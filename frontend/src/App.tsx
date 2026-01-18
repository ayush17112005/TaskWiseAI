import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeamList from './pages/TeamList';
import CreateTeam from './pages/CreateTeam';
import TeamDashboard from './pages/TeamDashboard';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import TaskList from './pages/TaskList';
import Analytics from './pages/Analytics';
import AIFeatures from './pages/AIFeatures';
import ProjectList from './pages/ProjectList';
// Layout
import MainLayout from './components/Layout/MainLayout';

// Protected Route
const ProtectedRoute: React.FC<{ children: React. ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Teams */}
            <Route path="teams" element={<TeamList />} />
            <Route path="teams/create" element={<CreateTeam />} />
            <Route path="teams/:teamId" element={<TeamDashboard />} />
            
            {/* Projects */}
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/:projectId" element={<ProjectView />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/:projectId" element={<ProjectView />} />

            <Route path="analytics" element={<Analytics />} />
            <Route path="ai" element={<AIFeatures />} />
    
            {/* Tasks */}
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/create" element={<CreateTask />} />
            <Route path="tasks/:taskId" element={<TaskDetail />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;