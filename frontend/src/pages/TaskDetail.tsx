import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { aiService } from '../services/aiService';
import type { Task } from '../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // AI States
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiType, setAIType] = useState<'assignee' | 'deadline' | 'priority' | 'breakdown' | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<unknown>(null);
  const [aiError, setAIError] = useState('');

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = useCallback(async () => {
    try {
      console.log('Fetching task:', taskId);
      const response = await taskService.getTaskById(taskId!);
      console.log('Task response:', response);
      if (response.success && response.data) {
        setTask(response.data.task);
      } else {
        setError('Failed to load task');
      }
    } catch (error: any) {
      console.error('Failed to fetch task:', error);
      setError(error.response?.data?.message || error.message || 'Task not found');
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  // AI Functions
  const handleAISuggestion = async (type: 'assignee' | 'deadline' | 'priority' | 'breakdown') => {
    setAIType(type);
    setShowAIDialog(true);
    setAILoading(true);
    setAIError('');
    setAIResponse(null);

    try {
      let response;

      switch (type) {
        case 'assignee':
          response = await aiService.suggestAssignee(taskId!);
          setAIResponse(response.data?.suggestion);
          break;

        case 'deadline':
          response = await aiService.suggestDeadline(taskId!);
          setAIResponse(response.data?.suggestion);
          break;

        case 'priority':
          response = await aiService.suggestPriority(taskId!);
          setAIResponse(response.data?.suggestion);
          break;

        case 'breakdown': 
          response = await aiService.breakdownTask(taskId!);
          setAIResponse(response.data?.breakdown);
          break;
      }
    } catch (error: unknown) {
      setAIError(error.response?.data?.message || 'AI suggestion failed.  Please try again.');
    } finally {
      setAILoading(false);
    }
  };

  const handleApplySuggestion = async () => {
    if (!aiResponse || !aiType) return;

    try {
      const updateData: Record<string, unknown> = {};

      switch (aiType) {
        case 'assignee':
          updateData.assignedTo = (aiResponse as unknown).suggestedUserId;
          break;
        case 'deadline':
          updateData.dueDate = (aiResponse as unknown).suggestedDeadline;
          break;
        case 'priority': 
          updateData.priority = (aiResponse as unknown).suggestedPriority;
          break;
        case 'breakdown':
          updateData.subtasks = (aiResponse as unknown).subtasks.map((st: unknown) => ({
            title: (st as unknown).title,
            completed: false,
          }));
          break;
      }

      await taskService.updateTask(taskId!, updateData);
      
      // Refresh task
      await fetchTask();
      
      // Close dialog
      setShowAIDialog(false);
      setAIResponse(null);
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-xl font-semibold text-error mb-2">
          {error || 'Task not found'}
        </h3>
        <p className="text-text-secondary mb-6">
          The task you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
          onClick={() => navigate('/tasks')}
          className="btn-primary"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4"
        >
          <ArrowBackIcon />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              task. status === 'done'
                ? 'bg-green-100 text-green-700'
                : task.status === 'in-progress'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {task.status}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
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
      </div>

      {/* Task Details Card */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <p className="mt-1 text-text-primary">{task.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary">Assigned To</label>
              <p className="mt-1 text-text-primary">
                {(task.assignedTo as unknown)?.name || 'Unassigned'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">Due Date</label>
              <p className="mt-1 text-text-primary">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">Estimated Hours</label>
              <p className="mt-1 text-text-primary">{task.estimatedHours || 'Not set'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">Tags</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {task.tags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section ⭐⭐⭐ */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-primary">
        <div className="flex items-center gap-3 mb-6">
          <SmartToyIcon className="text-primary" fontSize="large" />
          <div>
            <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
            <p className="text-sm text-text-secondary">Get intelligent suggestions to optimize your task</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
          {/* Suggest Assignee */}
          <button
            onClick={() => handleAISuggestion('assignee')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <PersonIcon className="text-primary" fontSize="large" />
            <div className="text-left">
              <h4 className="font-semibold">Suggest Assignee</h4>
              <p className="text-sm text-text-secondary">AI picks the best team member</p>
            </div>
          </button>

          {/* Suggest Deadline */}
          <button
            onClick={() => handleAISuggestion('deadline')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary hover: shadow-md transition-all"
          >
            <CalendarTodayIcon className="text-primary" fontSize="large" />
            <div className="text-left">
              <h4 className="font-semibold">Suggest Deadline</h4>
              <p className="text-sm text-text-secondary">AI predicts realistic timeline</p>
            </div>
          </button>

          {/* Suggest Priority */}
          <button
            onClick={() => handleAISuggestion('priority')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary hover: shadow-md transition-all"
          >
            <PriorityHighIcon className="text-primary" fontSize="large" />
            <div className="text-left">
              <h4 className="font-semibold">Suggest Priority</h4>
              <p className="text-sm text-text-secondary">AI determines urgency level</p>
            </div>
          </button>

          {/* Breakdown Task */}
          <button
            onClick={() => handleAISuggestion('breakdown')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover: border-primary hover:shadow-md transition-all"
          >
            <ListIcon className="text-primary" fontSize="large" />
            <div className="text-left">
              <h4 className="font-semibold">Breakdown Task</h4>
              <p className="text-sm text-text-secondary">AI splits into subtasks</p>
            </div>
          </button>
        </div>
      </div>

      {/* AI Dialog/Modal */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <SmartToyIcon className="text-primary" fontSize="large" />
                <h3 className="text-xl font-semibold">
                  AI Suggestion:  {aiType && aiType. charAt(0).toUpperCase() + aiType.slice(1)}
                </h3>
              </div>
              <button
                onClick={() => setShowAIDialog(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {aiLoading ?  (
                <div className="text-center py-12">
                  <SmartToyIcon className="text-primary animate-pulse mx-auto mb-4" style={{ fontSize: 64 }} />
                  <p className="text-text-secondary">AI is analyzing... </p>
                </div>
              ) : aiError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {aiError}
                </div>
              ) : aiResponse ? (
                <div className="space-y-4">
                  {/* Confidence Score */}
                  {aiResponse.confidence && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Confidence</label>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full"
                            style={{ width: `${aiResponse.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{Math.round(aiResponse.confidence * 100)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Assignee Suggestion */}
                  {aiType === 'assignee' && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Suggested Assignee</label>
                      <p className="mt-1 text-lg font-semibold text-primary">
                        {aiResponse.suggestedUserName}
                      </p>
                    </div>
                  )}

                  {/* Deadline Suggestion */}
                  {aiType === 'deadline' && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Suggested Deadline</label>
                      <p className="mt-1 text-lg font-semibold text-primary">
                        {new Date(aiResponse.suggestedDeadline).toLocaleDateString()} ({aiResponse.suggestedDays} days)
                      </p>
                    </div>
                  )}

                  {/* Priority Suggestion */}
                  {aiType === 'priority' && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Suggested Priority</label>
                      <p className="mt-1 text-lg font-semibold text-primary uppercase">
                        {aiResponse. suggestedPriority}
                      </p>
                    </div>
                  )}

                  {/* Breakdown Suggestion */}
                  {aiType === 'breakdown' && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Suggested Subtasks</label>
                      <ul className="mt-2 space-y-2">
                        {aiResponse. subtasks.map((subtask: unknown, index: number) => (
                          <li key={index} className="flex items-start gap-2 p-3 bg-background-gray rounded">
                            <CheckCircleIcon className="text-primary mt-1" fontSize="small" />
                            <div>
                              <p className="font-medium">{subtask.title}</p>
                              {subtask.description && (
                                <p className="text-sm text-text-secondary">{subtask.description}</p>
                              )}
                              {subtask.estimatedHours && (
                                <p className="text-xs text-text-secondary mt-1">
                                  ~{subtask.estimatedHours} hours
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reasoning */}
                  <div>
                    <label className="text-sm font-medium text-text-secondary">AI Reasoning</label>
                    <p className="mt-1 text-text-primary bg-background-gray p-4 rounded">
                      {aiResponse.reasoning}
                    </p>
                  </div>

                  {/* Disclaimer for New Teams */}
                  {aiResponse.disclaimer && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                      {aiResponse.disclaimer}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Dialog Footer */}
            {aiResponse && ! aiLoading && (
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={handleApplySuggestion}
                  className="btn-primary flex-1"
                >
                  Apply Suggestion
                </button>
                <button
                  onClick={() => setShowAIDialog(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;