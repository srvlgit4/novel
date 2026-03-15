import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hasQRCode } from '../utils/qrMapping';

interface Transaction {
  _id: string;
  telegramUsername: string;
  amount: number;
  planName: string;
  type: string;
  status: string;
  createdAt: string;
  expiryDate: string | null;
  screenshotUrl?: string;
}

interface Novel {
  _id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  qrImageUrl: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboardEnhanced: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingNovel, setDeletingNovel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'novels' | 'transactions'>('novels');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Calculate days remaining for a transaction
  const getDaysRemaining = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  // Check if transaction is expired
  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return getDaysRemaining(expiryDate)! < 0;
  };

  // Get row styling based on expiry
  const getRowStyle = (expiryDate: string | null) => {
    return isExpired(expiryDate) ? 'bg-red-900/20' : '';
  };

  // Filter transactions based on search query (case-insensitive)
  const filteredTransactions = transactions.filter(transaction =>
    transaction.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // No token found, redirect to login
      navigate('/admin-login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Fetch transactions
      const transactionsResponse = await axios.get('http://localhost:5000/api/admin/transactions', config);
      setTransactions(transactionsResponse.data.data || []);
      
      // Fetch novels
      const novelsResponse = await axios.get('http://localhost:5000/api/admin/novels', config);
      setNovels(novelsResponse.data.data || []);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNovel = (novel: Novel) => {
    setEditingNovel({...novel});
    setShowEditModal(true);
  };

  const handleDeleteTransaction = async (id: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete transaction for "@${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/admin/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh transactions list with token
      const transactionsResponse = await axios.get('http://localhost:5000/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTransactions(transactionsResponse.data.data || []);
      
      setMessage(`Transaction for "@${username}" deleted successfully!`);
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      setMessage('Error deleting transaction');
    }
  };

  const handleDeleteNovel = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setDeletingNovel(id);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/novels/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh novels list with token
      const novelsResponse = await axios.get('http://localhost:5000/api/admin/novels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNovels(novelsResponse.data.data || []);
      
      setMessage(`Novel "${title}" deleted successfully!`);
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Error deleting novel:', error);
      setMessage('Error deleting novel');
    } finally {
      setDeletingNovel(null);
    }
  };

  const handleViewSite = () => {
    navigate('/');
  };

  const handleAddNovel = () => {
    navigate('/admin/add-novel');
  };

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    
    // Show success message
    setMessage('Logged out successfully!');
    setTimeout(() => setMessage(''), 3000);
    
    // Navigate to login
    navigate('/admin-login');
  };

  const handleSaveEdit = async (updatedNovel: Partial<Novel>) => {
    if (!editingNovel) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.put(`http://localhost:5000/api/novels/${editingNovel._id}`, updatedNovel, config);
      
      // Refresh novels list with token
      const novelsResponse = await axios.get('http://localhost:5000/api/admin/novels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNovels(novelsResponse.data.data || []);
      
      setShowEditModal(false);
      setEditingNovel(null);
      setMessage('Novel updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Error updating novel:', error);
      setMessage('Error updating novel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-dark flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Glass-morphism Container */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">NovelTap Admin Dashboard</h1>
              <p className="text-gray-400">Manage your novel store and transactions</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleViewSite}
                className="bg-emerald hover:bg-emerald-dark text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 text-center ${
              message.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <button
              onClick={() => setActiveTab('novels')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'novels' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Manage Novels
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'transactions' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              User Transactions
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                    <path d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2v-5H2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Novels</p>
                  <p className="text-2xl font-bold text-white">{novels.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.801 7.801 0 006.714 0H4.667C4.853 0 4 0.147 4 .4v2.193C4 6.413 4.853 6.733 5.887 7.537c.575.378.528 0.933.391 1.18.1.537.288.802.398 1.02-.082.153-.292-.525-.41-.1.067-.372-.194-.457-.231-.563-.045.084-.108-.092-.343.54-.21-.71-.295-1.086-.322-.215-.344-.595-.188-.857-.34-.902z"/>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-3.4-3.4a3.007 3.007 0 01-4.244-1.076c-.688-.688-1.453-1.453a1.5 1.5 0 01-.213-.292L10.6 6.957C8.473 6.003 6.277 5.774 6.074 4.77c-.201-1.004.037-1.004.437-1.301.329-.446.596-.081 1.092.727.518.824 1.292 1.205 1.832 1.393.196-.01-.058-.083-.108-.092-.343-.54-.21-.71-.295-1.086-.322-.215-.344-.595-.188-.857-.34-.902z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'novels' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Novels Management</h2>
                <button
                  onClick={handleAddNovel}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                >
                  Add New Novel
                </button>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-600/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 px-4">Cover</th>
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {novels.map((novel) => (
                        <tr key={novel._id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={novel.coverImageUrl}
                              alt={novel.title}
                              className="w-16 h-20 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x100/1e40af/ffffff?text=Cover';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-medium">{novel.title}</td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-600 text-white px-2 py-1 rounded text-sm">
                              {novel.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">₹{novel.price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              novel.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                              {novel.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditNovel(novel)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteNovel(novel._id, novel.title)}
                                disabled={deletingNovel === novel._id}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 disabled:opacity-50"
                              >
                                {deletingNovel === novel._id ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  'Delete'
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">User Transactions</h2>
                <div className="w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search by Telegram username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-600/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 px-4">Username</th>
                        <th className="text-left py-3 px-4">Plan</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Expiry</th>
                        <th className="text-left py-3 px-4">Screenshot</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction._id} className={`border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${getRowStyle(transaction.expiryDate)}`}>
                          <td className="py-3 px-4 font-medium">@{transaction.telegramUsername}</td>
                          <td className="py-3 px-4">{transaction.planName}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">₹{transaction.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              transaction.type === 'Membership' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm ${
                              transaction.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {transaction.expiryDate ? (
                              <div className="flex flex-col">
                                <span className={`text-sm ${
                                  isExpired(transaction.expiryDate) ? 'text-red-400 font-bold' : 'text-gray-400'
                                }`}>
                                  {new Date(transaction.expiryDate).toLocaleDateString()}
                                </span>
                                <span className={`text-xs ${
                                  isExpired(transaction.expiryDate) ? 'text-red-300' : 'text-gray-500'
                                }`}>
                                  {getDaysRemaining(transaction.expiryDate)} days left
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {transaction.screenshotUrl ? (
                              <a
                                href={transaction.screenshotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">No screenshot</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteTransaction(transaction._id, transaction.telegramUsername)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingNovel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-darker rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Novel</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editingNovel.title}
                  onChange={(e) => setEditingNovel({...editingNovel, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={editingNovel.category}
                  onChange={(e) => setEditingNovel({...editingNovel, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Fantasy">Fantasy</option>
                  <option value="System Apocalypse">System Apocalypse</option>
                  <option value="Dark Fantasy">Dark Fantasy</option>
                  <option value="Cultivation">Cultivation</option>
                  <option value="Reincarnation">Reincarnation</option>
                  <option value="Romance">Romance</option>
                  <option value="Action">Action</option>
                  <option value="Adult">Adult</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={editingNovel.price}
                  onChange={(e) => setEditingNovel({...editingNovel, price: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
                {hasQRCode(editingNovel.price) && (
                  <p className="text-emerald-400 text-sm mt-1">✅ QR code available for ₹{editingNovel.price}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={editingNovel.coverImageUrl}
                  onChange={(e) => setEditingNovel({...editingNovel, coverImageUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingNovel.description}
                  onChange={(e) => setEditingNovel({...editingNovel, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editingNovel.isActive}
                    onChange={(e) => setEditingNovel({...editingNovel, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-white text-sm font-medium">Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingNovel)}
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardEnhanced;
