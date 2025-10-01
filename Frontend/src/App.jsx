import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      {/* Wrap the whole app with AuthProvider so authentication state is available everywhere */}
      <AuthProvider>
        {/* Wrap with TaskProvider so tasks data can be accessed globally */}
        <TaskProvider>
          <Routes>
            {/* Public routes (no login needed) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes (user must be logged in) */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  {/* Layout contains navbar/sidebar wrapping inner pages */}
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      {/* Default route goes to Dashboard */}
                      <Route path="/" element={<Dashboard />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
