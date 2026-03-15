import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple password check - in production, this should be a proper authentication system
    if (password === 'admin123') {
      // Store admin session in localStorage
      localStorage.setItem('adminToken', 'admin-jwt-token');
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-darker rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Enter your admin password to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login to Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
