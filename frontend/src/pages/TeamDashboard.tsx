// 📚 Team Dashboard - Show team members, workload, projects

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { projectService } from '../services/projectService';
import type { Team, Project } from '../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const TeamDashboard: React. FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workload, setWorkload] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      // Fetch team details
      const teamResponse = await teamService.getTeamById(teamId!);
      if (teamResponse.success && teamResponse.data) {
        setTeam(teamResponse.data.team);
      }

      // Fetch team projects
      const projectsResponse = await projectService.getProjects(teamId);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data.projects);
      }

      // Fetch team workload (optional - endpoint may not be implemented)
      try {
        const workloadResponse = await teamService.getTeamWorkload(teamId!);
        if (workloadResponse.success && workloadResponse.data) {
          setWorkload(workloadResponse.data);
        }
      } catch (workloadError) {
        // Workload endpoint not available, skip it
        console.log('Workload data not available');
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading team... </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="card text-center">
        <p className="text-text-secondary">Team not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/teams')}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4"
        >
          <ArrowBackIcon />
          <span>Back to Teams</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{team. name}</h1>
            <p className="text-text-secondary mt-1">{team.description}</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <PersonAddIcon />
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Team Members</p>
              <h3 className="text-3xl font-bold">{team. members?.length || 0}</h3>
            </div>
            <div className="bg-blue-50 text-info p-3 rounded-lg">
              <PersonAddIcon fontSize="large" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Active Projects</p>
              <h3 className="text-3xl font-bold">{projects.length}</h3>
            </div>
            <div className="bg-green-50 text-success p-3 rounded-lg">
              <FolderIcon fontSize="large" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Total Tasks</p>
              <h3 className="text-3xl font-bold">{workload?.totalTasks || 0}</h3>
            </div>
            <div className="bg-yellow-50 text-warning p-3 rounded-lg">
              <AssignmentIcon fontSize="large" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active Tasks</th>
                <th>Completed Tasks</th>
              </tr>
            </thead>
            <tbody>
              {team. members?.map((member: unknown, index) => {
                const memberWorkload = workload?.workload?. find(
                  (w: unknown) => w.userId. toString() === member.userId._id?. toString()
                );

                return (
                  <tr key={index}>
                    <td className="font-medium">{member.userId.name || 'Unknown'}</td>
                    <td className="text-text-secondary">{member.userId.email || 'N/A'}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === 'owner'
                            ? 'bg-primary text-white'
                            :  member.role === 'admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td>{memberWorkload?.activeTasks || 0}</td>
                    <td>{memberWorkload?.completedTasks || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button className="btn-outline text-sm">
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <FolderIcon style={{ fontSize: 48 }} className="mx-auto mb-2" />
            <p>No projects yet.  Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-4 bg-background-gray rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className="flex items-center gap-3">
                  <FolderIcon className="text-primary" />
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-text-secondary">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project. status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Performance (if workload data available) */}
      {workload && workload.workload && workload.workload.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUpIcon className="text-primary" />
            Team Workload Distribution
          </h2>
          <div className="space-y-4">
            {workload.workload.map((member: unknown, index:  number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-text-secondary">
                    {member.totalTasks} tasks ({member.activeTasks} active)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${Math.min((member.activeTasks / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;