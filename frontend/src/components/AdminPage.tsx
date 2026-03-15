import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Transaction {
  _id: string;
  telegramUsername: string;
  amount: number;
  planName: string;
  type: string;
  status: string;
  createdAt: string;
  expiryDate: string | null;
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

const AdminPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'novels'>('transactions');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    activeNovels: 0
  });
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

  // Get days left text
  const getDaysLeftText = (expiryDate: string | null) => {
    if (!expiryDate) return 'N/A';
    const days = getDaysRemaining(expiryDate)!;
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    return `${days} days left`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const transactionsResponse = await axios.get('http://localhost:5000/api/admin/transactions');
      setTransactions(transactionsResponse.data.data || []);
      
      // Fetch novels
      const novelsResponse = await axios.get('http://localhost:5000/api/admin/novels');
      setNovels(novelsResponse.data.data || []);
      
      // Calculate stats
      const txnData = transactionsResponse.data.data || [];
      const novelsData = novelsResponse.data.data || [];
      
      setStats({
        totalRevenue: txnData.reduce((sum: number, txn: Transaction) => sum + txn.amount, 0),
        totalTransactions: txnData.length,
        activeNovels: novelsData.filter((n: Novel) => n.isActive).length
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin-login');
  };

  const handleViewSite = () => {
    navigate('/');
  };

  const handleAddNovel = () => {
    navigate('/admin/add-novel');
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your novel store and transactions</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleViewSite}
              className="bg-emerald hover:bg-emerald-dark text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              View Site
            </button>
            <button
              onClick={handleAddNovel}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Add Novel
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-darker rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue}</p>
              </div>
              <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-darker rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-darker rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Novels</p>
                <p className="text-2xl font-bold text-white">{stats.activeNovels}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-darker rounded-lg border border-gray-700">
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'transactions'
                    ? 'text-emerald border-b-2 border-emerald'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Transactions ({transactions.length})
              </button>
              <button
                onClick={() => setActiveTab('novels')}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'novels'
                    ? 'text-emerald border-b-2 border-emerald'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Novels ({novels.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-400 text-sm font-medium">Username</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Type</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Plan</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Amount</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Date</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Expiry Date</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Days Left</th>
                      <th className="pb-3 text-gray-400 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id} className={`border-b border-gray-700 ${getRowStyle(transaction.expiryDate)}`}>
                        <td className="py-3 text-white">@{transaction.telegramUsername}</td>
                        <td className="py-3 text-white">
                          <span className={`px-2 py-1 text-xs rounded ${
                            transaction.type === 'Novel' 
                              ? 'bg-blue-900 text-blue-200' 
                              : 'bg-purple-900 text-purple-200'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 text-white">{transaction.planName}</td>
                        <td className="py-3 text-white">₹{transaction.amount}</td>
                        <td className="py-3 text-gray-400 text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className={`py-3 text-sm ${isExpired(transaction.expiryDate) ? 'text-red-400' : 'text-gray-400'}`}>
                          {transaction.expiryDate 
                            ? new Date(transaction.expiryDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                        <td className={`py-3 text-sm font-medium ${isExpired(transaction.expiryDate) ? 'text-red-400' : 'text-gray-400'}`}>
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              isExpired(transaction.expiryDate) 
                                ? 'bg-red-500 shadow-red-500/50' 
                                : 'bg-emerald-500 shadow-emerald-500/50'
                            } shadow-sm`}></span>
                            {getDaysLeftText(transaction.expiryDate)}
                          </div>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'novels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {novels.map((novel) => (
                  <div key={novel._id} className="bg-slate-dark rounded-lg p-4 border border-gray-700">
                    <div className="h-32 bg-gray-700 rounded mb-4 flex items-center justify-center">
                      <img
                        src={novel.coverImageUrl}
                        alt={novel.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150/1e40af/ffffff?text=Cover';
                        }}
                      />
                    </div>
                    <h3 className="text-white font-medium mb-2 truncate">{novel.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{novel.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald font-medium">₹{novel.price}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        novel.isActive 
                          ? 'bg-emerald-dark text-emerald' 
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {novel.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
