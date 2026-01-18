import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import type { Task } from '../types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      const response = await taskService.getMyTasks();
      console.log('Tasks response:', response);
      if (response.success && response.data) {
        let filteredTasks = response.data.tasks;
        
        if (filter !== 'all') {
          filteredTasks = filteredTasks.filter((task: Task) => task.status === filter);
        }
        
        setTasks(filteredTasks);
      } else {
        setError('Failed to load tasks');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'in-progress':
        return 'bg-warning text-white';
      case 'pending':
        return 'bg-text-secondary text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12 bg-error bg-opacity-10">
        <h3 className="text-xl font-semibold text-error mb-2">Error Loading Tasks</h3>
        <p className="text-text-secondary mb-6">{error}</p>
        <button
          onClick={() => fetchTasks()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-text-secondary mt-1">Manage and track your tasks</p>
        </div>
        <button
          onClick={() => navigate('/tasks/create')}
          className="btn-primary flex items-center gap-2"
        >
          <AddIcon />
          Create Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-background-gray'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <AssignmentIcon className="text-text-secondary mx-auto mb-4" style={{ fontSize: 64 }} />
          <h3 className="text-xl font-semibold mb-2">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="text-text-secondary mb-6">
            {filter === 'all' 
              ? 'Create your first task to get started'
              : `You don't have any ${filter} tasks`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/tasks/create')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <AddIcon />
              Create Your First Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Link
              key={task._id}
              to={`/tasks/${task._id}`}
              className="card hover:shadow-lg hover:border-primary transition-all cursor-pointer block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                  <FlagIcon fontSize="small" />
                  <span className="capitalize">{task.priority}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-text-secondary">
                    <AccessTimeIcon fontSize="small" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                {task.project && typeof task.project === 'object' && (
                  <div className="text-text-secondary">
                    Project: {task.project.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
