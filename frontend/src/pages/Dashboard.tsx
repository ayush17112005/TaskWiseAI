// 📚 Dashboard - WITH REAL DATA FROM API

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/teamService';
import { taskService } from '../services/taskService';
import type { Task, Team } from '../types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // State for real data
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch teams
      const teamsResponse = await teamService.getMyTeams();
      if (teamsResponse.success && teamsResponse.data) {
        setTeams(teamsResponse.data. teams);
      }

      // Fetch all tasks
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse. success && tasksResponse.data) {
        setTasks(tasksResponse.data.  tasks);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate real stats from data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const totalTeams = teams.length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks. toString(),
      icon: <AssignmentIcon fontSize="large" />,
      color: 'text-info',
      bgColor:  'bg-blue-50',
    },
    {
      label: 'Completed',
      value: completedTasks. toString(),
      icon: <CheckCircleIcon fontSize="large" />,
      color: 'text-success',
      bgColor:  'bg-green-50',
    },
    {
      label: 'In Progress',
      value: inProgressTasks. toString(),
      icon: <PendingIcon fontSize="large" />,
      color: 'text-warning',
      bgColor:  'bg-yellow-50',
    },
    {
      label: 'Teams',
      value: totalTeams.toString(),
      icon: <GroupIcon fontSize="large" />,
      color: 'text-primary',
      bgColor: 'bg-green-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading dashboard... </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user?.name}!  🎉
        </h1>
        <p className="text-text-secondary">
          {totalTasks > 0
            ? `You have ${totalTasks} task${totalTasks !== 1 ? 's' : ''} across ${totalTeams} team${totalTeams !== 1 ?  's' : ''}. `
            : "Let's get started by creating your first team! "}
        </p>
      </div>

      {/* Stats Cards - REAL DATA! */}
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
        <div className="grid grid-cols-1 md: grid-cols-3 gap-4">
          <Link
            to="/teams/create"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition-all"
          >
            <GroupIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">Create Team</h3>
            <p className="text-sm text-text-secondary">Start collaborating with your team</p>
          </Link>

          <Link
            to="/projects/create"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition-all"
          >
            <FolderIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">New Project</h3>
            <p className="text-sm text-text-secondary">Organize tasks into projects</p>
          </Link>

          <Link
            to="/tasks/create"
            className="p-4 border-2 border-primary rounded-lg bg-green-50 hover:bg-green-100 transition-all"
          >
            <TrendingUpIcon className="text-primary mb-2" fontSize="large" />
            <h3 className="font-semibold text-text-primary mb-1">Create Task ✨</h3>
            <p className="text-sm text-text-secondary">Then use AI to optimize it!</p>
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <AssignmentIcon style={{ fontSize: 48 }} className="mx-auto mb-2" />
            <p>No tasks yet.  Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="flex items-center gap-4 p-3 bg-background-gray rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{task.title}</h4>
                  <p className="text-sm text-text-secondary">
                    {task.description?. substring(0, 60)}
                    {task.description && task.description.length > 60 ?  '.. .' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'urgent'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* My Teams */}
      {teams.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">My Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Link
                key={team._id}
                to={`/teams/${team._id}`}
                className="p-4 bg-background-gray rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <GroupIcon className="text-primary" />
                  <h4 className="font-semibold">{team.name}</h4>
                </div>
                <p className="text-sm text-text-secondary">
                  {team.members?. length || 0} member{team.members?.length !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;