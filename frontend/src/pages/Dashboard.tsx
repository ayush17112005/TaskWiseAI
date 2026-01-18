import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Tasks',
      value: '24',
      icon: <AssignmentIcon fontSize="large" />,
      color: 'text-info',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: '12',
      icon: <CheckCircleIcon fontSize="large" />,
      color: 'text-success',
      bgColor: 'bg-green-50',
    },
    {
      label: 'In Progress',
      value: '8',
      icon: <PendingIcon fontSize="large" />,
      color: 'text-warning',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Teams',
      value: '3',
      icon: <GroupIcon fontSize="large" />,
      color: 'text-primary',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user?.name}!  🎉
        </h1>
        <p className="text-text-secondary">
          Here's what's happening with your projects today. 
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-text-primary">{stat.value}</h3>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/teams"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition-all"
          >
            <GroupIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">Create Team</h3>
            <p className="text-sm text-text-secondary">Start collaborating with your team</p>
          </Link>

          <Link
            to="/projects"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition-all"
          >
            <FolderIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">New Project</h3>
            <p className="text-sm text-text-secondary">Organize tasks into projects</p>
          </Link>

          <Link
            to="/ai"
            className="p-4 border-2 border-primary rounded-lg bg-green-50 hover:bg-green-100 transition-all"
          >
            <TrendingUpIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">AI Features ✨</h3>
            <p className="text-sm text-text-secondary">Get intelligent suggestions</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-background-gray rounded-lg">
            <CheckCircleIcon className="text-success" />
            <div>
              <p className="font-medium text-text-primary">Task completed</p>
              <p className="text-sm text-text-secondary">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-background-gray rounded-lg">
            <GroupIcon className="text-info" />
            <div>
              <p className="font-medium text-text-primary">New team member joined</p>
              <p className="text-sm text-text-secondary">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-background-gray rounded-lg">
            <FolderIcon className="text-warning" />
            <div>
              <p className="font-medium text-text-primary">Project deadline approaching</p>
              <p className="text-sm text-text-secondary">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;