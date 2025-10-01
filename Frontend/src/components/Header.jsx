import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Header component with user info and navigation
const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  // Check if current path is active
  const checkActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* App logo and name */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-slate-400 text-sm">Smart Task Management</p>
          </div>
        </div>

        {/* Right side - navigation and user menu */}
        <div className="flex items-center gap-6">
          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-6 text-slate-300">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`hover:text-teal-400 transition-colors font-medium ${
                checkActive('/dashboard') ? 'text-teal-400' : ''
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className={`hover:text-teal-400 transition-colors font-medium ${
                checkActive('/profile') ? 'text-teal-400' : ''
              }`}
            >
              Profile
            </button>
          </div>

          {/* Notification bell with badge */}
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800"></span>
          </button>
          
          {/* User profile dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {/* User avatar with initial */}
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* User name and email - hidden on small screens */}
              <div className="hidden sm:block text-left">
                <span className="text-sm font-medium text-white block">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-slate-400 block">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg py-2 z-50">
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <div className="border-t border-slate-700 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-slate-700 bg-slate-800">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center transition-colors ${
              checkActive('/dashboard') ? 'text-teal-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mb-1 ${
              checkActive('/dashboard') ? 'bg-teal-400' : 'bg-transparent'
            }`} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center transition-colors ${
              checkActive('/profile') ? 'text-teal-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mb-1 ${
              checkActive('/profile') ? 'bg-teal-400' : 'bg-transparent'
            }`} />
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-white transition-colors">
            <div className="w-2 h-2 bg-transparent rounded-full mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;