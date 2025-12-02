import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { mockAuth } from './utils/mockAuth';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SubmitStruggle = lazy(() => import('./pages/SubmitStruggle'));
const CommunityStruggles = lazy(() => import('./pages/CommunityStruggles'));
const StruggleDetails = lazy(() => import('./pages/StruggleDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PersonalDashboard = lazy(() => import('./pages/PersonalDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const MentorBooking = lazy(() => import('./pages/MentorBooking'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const LoadingSpinner = () => (
  <div className="min-h-screen pt-16 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-crimson-accent/20 border-t-crimson-accent rounded-full animate-spin"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!mockAuth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = mockAuth.getCurrentUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/submit" element={<SubmitStruggle />} />
            <Route path="/community" element={<CommunityStruggles />} />
            <Route path="/struggle/:id" element={<StruggleDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/my-dashboard"
              element={<Navigate to="/profile" replace />}
            />
            <Route
              path="/mentor-dashboard"
              element={
                <ProtectedRoute>
                  <MentorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-session"
              element={
                <ProtectedRoute>
                  <MentorBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

