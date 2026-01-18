// 📚 Create Project Page

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { Team } from '../types';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getMyTeams();
      if (response.success && response.data) {
        setTeams(response.data. teams);
        if (response.data.teams.length > 0) {
          setTeamId(response.data. teams[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamId) {
      setError('Please select a team');
      return;
    }

    setIsLoading(true);

    try {
      const response = await projectService.createProject({
        name,
        teamId,
        description,
        priority,
        startDate:  startDate || undefined,
        endDate: endDate || undefined,
      });

      if (response.success) {
        navigate(`/projects/${response.data?. project._id}`);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (teams.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <FolderIcon style={{ fontSize: 64 }} className="text-text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Teams Found</h2>
          <p className="text-text-secondary mb-6">
            You need to create a team before creating a project.
          </p>
          <button onClick={() => navigate('/teams/create')} className="btn-primary">
            Create Team First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6"
      >
        <ArrowBackIcon />
        <span>Back</span>
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary text-white p-3 rounded-lg">
            <FolderIcon fontSize="large" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-text-secondary">Organize your tasks into projects</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., Website Redesign"
              required
            />
          </div>

          {/* Team Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Team *
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target. value)}
              className="input"
              required
            >
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
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
              placeholder="What is this project about?"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target. value)}
                className="input"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
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

export default CreateProject;