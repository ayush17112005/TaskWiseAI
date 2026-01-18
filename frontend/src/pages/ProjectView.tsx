// 📚 Project View - Show project details and tasks

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import type { Project, Task } from '../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
const ProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      // Fetch project
      const projectResponse = await projectService.getProjectById(projectId! );
      if (projectResponse.success && projectResponse.data) {
        setProject(projectResponse.data. project);
      }

      // Fetch tasks
      const tasksResponse = await taskService. getTasks(projectId);
      if (tasksResponse. success && tasksResponse.data) {
        setTasks(tasksResponse.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card text-center">
        <p className="text-text-secondary">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4"
        >
          <ArrowBackIcon />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project. name}</h1>
            <p className="text-text-secondary mt-1">{project.description}</p>
          </div>
          <button
            onClick={() => navigate(`/tasks/create? projectId=${projectId}`)}
            className="btn-primary flex items-center gap-2"
          >
            <AddIcon />
            New Task
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Total Tasks</p>
          <h3 className="text-3xl font-bold">{tasks.length}</h3>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Completed</p>
          <h3 className="text-3xl font-bold text-success">
            {tasks.filter((t) => t.status === 'done').length}
          </h3>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">In Progress</p>
          <h3 className="text-3xl font-bold text-info">
            {tasks.filter((t) => t.status === 'in-progress').length}
          </h3>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">To Do</p>
          <h3 className="text-3xl font-bold text-warning">
            {tasks.filter((t) => t.status === 'todo').length}
          </h3>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No tasks yet</p>
            <button
              onClick={() => navigate(`/tasks/create?projectId=${projectId}`)}
              className="btn-primary"
            >
              Create First Task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="cursor-pointer"
                  >
                    <td className="font-medium">{task. title}</td>
                    <td>
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
                    </td>
                    <td>
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
                    </td>
                    <td className="text-text-secondary">
                      {(task.assignedTo as unknown)?.name || 'Unassigned'}
                    </td>
                    <td className="text-text-secondary">
                      {task.dueDate
                        ? new Date(task. dueDate).toLocaleDateString()
                        : 'Not set'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;