import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// =============================================
// SAMUEL FOTSO PORTFOLIO - PROTECTED ROUTE COMPONENT
// =============================================

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in, you have access - no admin checking needed
  return children;
};

export default ProtectedRoute;