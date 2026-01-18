import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label:  'Dashboard' },
    { path: '/teams', icon: <GroupIcon />, label: 'Teams' },
    { path: '/projects', icon: <FolderIcon />, label: 'Projects' },
    { path: '/tasks', icon: <AssignmentIcon />, label: 'Tasks' },
    { path: '/analytics', icon: <BarChartIcon />, label: 'Analytics' },
    { path: '/ai', icon: <SmartToyIcon />, label: 'AI Features', badge: 'NEW' },
  ];

  const isActive = (path: string) => location.pathname. startsWith(path);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <CheckCircleIcon />
          TaskWise AI
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-background-gray hover:text-text-primary'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-success text-white text-xs px-2 py-1 rounded">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-text-secondary text-center">
          v1.0.0 • AI-Powered
        </div>
      </div>
    </div>
  );
};

export default Sidebar;