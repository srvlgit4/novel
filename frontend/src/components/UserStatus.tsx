import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserStatusData {
  _id: string;
  telegramUsername: string;
  type: string;
  planName: string;
  amount: number;
  createdAt: string;
  expiryDate: string;
  status: string;
  daysRemaining: number;
  isExpired: boolean;
}

const UserStatus: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserStatusData | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a Telegram username');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);

    try {
      // Remove @ symbol if present and clean the username
      const cleanUsername = trimmedUsername.startsWith('@') 
        ? trimmedUsername.substring(1) 
        : trimmedUsername;
      
      const response = await axios.get(`http://localhost:5000/api/transactions/user/${cleanUsername}`);
      setUserData(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('No membership found for this username');
      } else {
        setError('Error fetching user status');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!userData) return '';
    return userData.isExpired ? 'text-red-400' : 'text-emerald-400';
  };

  const getStatusBg = () => {
    if (!userData) return '';
    return userData.isExpired 
      ? 'bg-red-900/20 border-red-700' 
      : 'bg-emerald-900/20 border-emerald-500 shadow-lg shadow-emerald-500/25';
  };

  return (
    <div className="min-h-screen bg-slate-dark py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with back button */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Back to Home
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Check Your Status</h1>
          <p className="text-gray-400 text-lg">Enter your Telegram username to view your membership details</p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-darker rounded-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
                Telegram Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-3 bg-slate-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Searching...' : 'Check Status'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/10 border border-red-800/50 text-red-300 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* User Status Card */}
        {userData && (
          <div className={`rounded-xl p-8 border-2 ${getStatusBg()}`}>
            <div className="text-center">
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getStatusColor()}`}>
                  {userData.status}
                </span>
              </div>

              {/* Membership Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Membership Found!</h3>
                  <p className="text-gray-300">Welcome back, @{userData.telegramUsername}!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Plan</p>
                    <p className="text-white font-semibold">{userData.planName}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-white font-semibold">₹{userData.amount}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Expiry Date</p>
                    <p className={`font-semibold ${userData.isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                      {userData.expiryDate ? new Date(userData.expiryDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Days Remaining</p>
                    <p className={`font-semibold ${userData.isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                      {userData.isExpired ? `Expired ${Math.abs(userData.daysRemaining)} days ago` : `${userData.daysRemaining} days left`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Date */}
              <div className="text-sm text-gray-500 mt-4">
                Purchased on {new Date(userData.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStatus;
