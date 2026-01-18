import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <CheckCircleIcon fontSize="large" />
              TaskWise AI
            </h1>
            <p className="text-text-secondary mt-2">
              Create your account and start managing smarter
            </p>
          </div>

          {/* Register Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <PersonIcon className="absolute left-3 top-3 text-text-secondary" fontSize="small" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 text-text-secondary" fontSize="small" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled: cursor-not-allowed"
              >
                {isLoading ?  'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-text-secondary mt-6">
              Already have an account? {' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg: w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Join thousands of teams
          </h2>
          <p className="text-green-100 text-lg mb-8">
            TaskWise AI helps teams collaborate better and deliver projects faster with intelligent automation. 
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon />
              <span>AI-powered task management</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon />
              <span>Real-time team collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon />
              <span>Advanced analytics & insights</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon />
              <span>Free to get started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;