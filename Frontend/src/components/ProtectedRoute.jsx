// ProtectedRoute component - prevents unauthorized access to pages
// This component checks if user is logged in before showing protected content
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get user authentication state and loading status
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the protected content
  // If not logged in, redirect to login page
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;