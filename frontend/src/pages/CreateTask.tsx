// 📚 Create Task Page

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import type { Project } from '../types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projectIdFromUrl || '');
  const [priority, setPriority] = useState('medium');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      if (response.success && response.data) {
        setProjects(response.data.projects);
        if (! projectIdFromUrl && response.data.projects.length > 0) {
          setProjectId(response.data.projects[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!projectId) {
      setError('Please select a project');
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag. length > 0);

      const response = await taskService. createTask({
        title,
        projectId,
        description,
        priority,
        estimatedHours:  estimatedHours ? parseInt(estimatedHours) : undefined,
        dueDate:  dueDate || undefined,
        tags: tagsArray. length > 0 ? tagsArray : undefined,
      });

      if (response.success) {
        navigate(`/tasks/${response.data?.task._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <AssignmentIcon style={{ fontSize: 64 }} className="text-text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Projects Found</h2>
          <p className="text-text-secondary mb-6">
            You need to create a project before creating tasks.
          </p>
          <button onClick={() => navigate('/projects/create')} className="btn-primary">
            Create Project First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover: text-primary mb-6"
      >
        <ArrowBackIcon />
        <span>Back</span>
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary text-white p-3 rounded-lg">
            <AssignmentIcon fontSize="large" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create New Task</h1>
            <p className="text-text-secondary">Add a task to your project</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., Fix authentication bug"
              required
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target. value)}
              className="input"
              required
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={4}
              placeholder="Describe the task in detail..."
            />
          </div>

          {/* Priority & Estimated Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target. value)}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="input"
                placeholder="e.g., 5"
                min="0"
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target. value)}
              className="input"
              placeholder="e.g., backend, urgent, bug-fix"
            />
            <p className="text-xs text-text-secondary mt-1">
              Separate tags with commas.  AI uses tags to suggest assignees! 
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;