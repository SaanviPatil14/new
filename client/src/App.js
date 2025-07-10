import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Vote from './pages/Vote';
import Results from './pages/Results';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVotes from './pages/admin/AdminVotes';
import CandidateProfile from './pages/CandidateProfile';
import Profile from './pages/Profile';
import LoadingSpinner from './components/common/LoadingSpinner';

// ProtectedRoute stays the same
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user?.userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      {/* Routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes with layout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/candidates"
        element={
          <MainLayout>
            <Candidates />
          </MainLayout>
        }
      />
      <Route
        path="/candidates/:id"
        element={
          <MainLayout>
            <CandidateProfile />
          </MainLayout>
        }
      />
      <Route
        path="/results"
        element={
          <MainLayout>
            <Results />
          </MainLayout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vote"
        element={
          <ProtectedRoute allowedUserTypes={['voter']}>
            <MainLayout>
              <Vote />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedUserTypes={['admin']}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/candidates"
        element={
          <ProtectedRoute allowedUserTypes={['admin']}>
            <MainLayout>
              <AdminCandidates />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedUserTypes={['admin']}>
            <MainLayout>
              <AdminUsers />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/votes"
        element={
          <ProtectedRoute allowedUserTypes={['admin']}>
            <MainLayout>
              <AdminVotes />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
