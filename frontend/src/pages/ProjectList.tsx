import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import type { Project } from '../types';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      if (response.success && response.data) {
        setProjects(response.data. projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-text-secondary mt-1">Manage your team projects</p>
        </div>
        <button
          onClick={() => navigate('/projects/create')}
          className="btn-primary flex items-center gap-2"
        >
          <AddIcon />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <FolderIcon className="text-text-secondary mx-auto mb-4" style={{ fontSize: 64 }} />
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-text-secondary mb-6">
            Create your first project to organize tasks
          </p>
          <button
            onClick={() => navigate('/projects/create')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <AddIcon />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="card hover:shadow-lg hover:border-primary transition-all cursor-pointer"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary text-white p-3 rounded-lg">
                  <FolderIcon fontSize="large" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : project.status === 'on-hold'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Project Info */}
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              
              {project.description && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              {/* Priority Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.priority === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : project.priority === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : project.priority === 'medium'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.priority}
                </span>

                {/* Team Name (if populated) */}
                {typeof project.team === 'object' && project.team && (
                  <span className="text-sm text-text-secondary">
                    {(project.team as { name: string }).name}
                  </span>
                )}
              </div>

              {/* Dates */}
              {(project.startDate || project.endDate) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-text-secondary">
                    {project.startDate && (
                      <span>
                        Start: {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {project.endDate && (
                      <span>
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;