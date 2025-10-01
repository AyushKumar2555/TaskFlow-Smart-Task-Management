// AuthContext - manages user authentication state across the app
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

// Create authentication context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Main authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [loading, setLoading] = useState(true); // Loading state for auth checks

  // Check authentication status when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verify if user is logged in by checking token
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // If no token found, user is not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch user profile using the token
      const userData = await authAPI.getProfile();
      setUser(userData);
      
    } catch (error) {
      console.error('Authentication check failed:', error);
      
      // If token is invalid, clear it from storage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.token) {
        // Store token and update user state
        localStorage.setItem('token', response.token);
        setUser(response.user || response);
        return { success: true };
      } else {
        return { success: false, error: 'No token received' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Handle user registration
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.token) {
        // Store token and update user state
        localStorage.setItem('token', response.token);
        setUser(response.user || response);
        return { success: true };
      } else {
        return { success: false, error: 'No token received' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login'; // Redirect to login page
  };

  // Value provided to consumers of this context
  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
