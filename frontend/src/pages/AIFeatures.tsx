// 📚 AI Features Page - Info about AI capabilities

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ListIcon from '@mui/icons-material/List';

const AIFeatures: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PersonIcon fontSize="large" />,
      title: 'Smart Task Assignment',
      description: 'AI analyzes team member skills, workload, and past performance to suggest the best person for each task.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon:  <CalendarTodayIcon fontSize="large" />,
      title: 'Deadline Prediction',
      description: 'Based on historical completion times and team velocity, AI predicts realistic deadlines for tasks.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: <PriorityHighIcon fontSize="large" />,
      title: 'Priority Detection',
      description: 'AI reads task descriptions and determines urgency level using natural language processing.',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: <ListIcon fontSize="large" />,
      title:  'Task Breakdown',
      description: 'Complex tasks are automatically decomposed into smaller, actionable subtasks by AI.',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex items-center gap-4 mb-4">
          <SmartToyIcon style={{ fontSize: 64 }} />
          <div>
            <h1 className="text-3xl font-bold">AI-Powered Features</h1>
            <p className="text-green-100 mt-1">
              Intelligent automation powered by Google Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <div className={`${feature.color} p-4 rounded-lg inline-block mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature. title}</h3>
            <p className="text-text-secondary">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How to Use */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">How to Use AI Features</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Create a Task</h4>
              <p className="text-text-secondary text-sm">
                Add a new task to any project with a detailed description and tags
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold">Open Task Detail</h4>
              <p className="text-text-secondary text-sm">
                Click on the task to view its detail page
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold">Click AI Recommendation Buttons</h4>
              <p className="text-text-secondary text-sm">
                Choose which AI feature you want (assignee, deadline, priority, or breakdown)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold">Review & Apply</h4>
              <p className="text-text-secondary text-sm">
                AI shows its suggestion with reasoning and confidence score.  Apply if you agree!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="card bg-green-50 border-2 border-primary text-center">
        <h3 className="text-xl font-semibold mb-2">Ready to Try?</h3>
        <p className="text-text-secondary mb-4">
          Create a task and experience AI-powered project management
        </p>
        <button
          onClick={() => navigate('/tasks/create')}
          className="btn-primary"
        >
          Create Task Now
        </button>
      </div>
    </div>
  );
};

export default AIFeatures;