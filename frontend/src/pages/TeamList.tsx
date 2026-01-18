import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import type { Team } from '../types';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';

const TeamsList: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setError('');
      const response = await teamService.getMyTeams();
      console.log('Teams response:', response);
      if (response.success && response.data) {
        setTeams(response.data.teams);
      } else {
        setError('Failed to load teams');
      }
    } catch (error: any) {
      console.error('Failed to fetch teams:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12 bg-error bg-opacity-10">
        <h3 className="text-xl font-semibold text-error mb-2">Error Loading Teams</h3>
        <p className="text-text-secondary mb-6">{error}</p>
        <button
          onClick={() => fetchTeams()}
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
          <h1 className="text-3xl font-bold">My Teams</h1>
          <p className="text-text-secondary mt-1">Manage your teams and collaborate</p>
        </div>
        <button
          onClick={() => navigate('/teams/create')}
          className="btn-primary flex items-center gap-2"
        >
          <AddIcon />
          Create Team
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="card text-center py-12">
          <GroupIcon className="text-text-secondary mx-auto mb-4" style={{ fontSize: 64 }} />
          <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
          <p className="text-text-secondary mb-6">
            Create your first team to start collaborating
          </p>
          <button
            onClick={() => navigate('/teams/create')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <AddIcon />
            Create Your First Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md: grid-cols-2 lg: grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team._id}
              to={`/teams/${team._id}`}
              className="card hover:shadow-lg hover:border-primary transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary text-white p-3 rounded-lg">
                  <GroupIcon fontSize="large" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
              
              {team.description && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {team.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <PeopleIcon fontSize="small" />
                <span>{team.members?. length || 0} members</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsList;