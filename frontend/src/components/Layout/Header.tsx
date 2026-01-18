// 📚 Header - Top bar with user info and actions

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Page Title / Breadcrumb */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">
          Welcome back, {user?.name?. split(' ')[0] || 'User'}!  👋
        </h2>
      </div>

      {/* Right Side - Notifications & User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-background-gray rounded-lg transition-colors relative">
          <NotificationsIcon className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-background-gray rounded-lg transition-colors"
          >
            <AccountCircleIcon className="text-text-secondary" fontSize="large" />
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">{user?.name}</div>
              <div className="text-xs text-text-secondary">{user?.email}</div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-background-gray flex items-center gap-3 text-text-primary">
                <SettingsIcon fontSize="small" />
                <span>Settings</span>
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-background-gray flex items-center gap-3 text-error"
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;