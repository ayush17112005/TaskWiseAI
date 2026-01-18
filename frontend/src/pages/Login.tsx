// 📚 Login Page - Clean HackerRank design

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e:  React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Login failed.  Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <CheckCircleIcon fontSize="large" />
              TaskWise AI
            </h1>
            <p className="text-text-secondary mt-2">
              AI-powered project management
            </p>
          </div>

          {/* Login Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Login</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  <EmailIcon className="absolute left-3 top-3 text-text-secondary" fontSize="small" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 text-text-secondary" fontSize="small" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-text-secondary mt-6">
              Don't have an account? {' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Manage projects smarter with AI
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Smart Task Assignment</h3>
                <p className="text-green-100">AI analyzes team performance to suggest the best assignee</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Deadline Prediction</h3>
                <p className="text-green-100">Learn from historical data to predict realistic deadlines</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Team Analytics</h3>
                <p className="text-green-100">Track performance, workload, and productivity metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;