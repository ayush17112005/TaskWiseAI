import React from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-1">Team performance insights</p>
      </div>

      <div className="card text-center py-12">
        <BarChartIcon style={{ fontSize: 64 }} className="text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Analytics Dashboard</h2>
        <p className="text-text-secondary mb-6">
          View team performance, project progress, and AI usage statistics
        </p>
        <p className="text-sm text-text-secondary">
          💡 This feature shows analytics from the backend /analytics endpoints
        </p>
      </div>

      {/* You can add real analytics here later */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">AI Suggestions Used</p>
          <h3 className="text-3xl font-bold">0</h3>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Tasks Completed</p>
          <h3 className="text-3xl font-bold">0</h3>
        </div>
        <div className="card">
          <p className="text-text-secondary text-sm mb-1">Team Efficiency</p>
          <h3 className="text-3xl font-bold">N/A</h3>
        </div>
      </div>
    </div>
  );
};

export default Analytics;