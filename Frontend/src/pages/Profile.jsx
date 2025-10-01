// Profile component - user profile management interface
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Save, X, Camera, Mail, Calendar, Settings, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || ''
  });

  // Handle form submission for profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form data
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing and reset form data
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
    setError('');
  };

  // Format date for display
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 animate-scale-in shadow-xl">
          {/* Profile header section */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-slate-400">Manage your account information</p>
              </div>
            </div>
            {/* Edit profile button - only show when not editing */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 animate-fade-in">
              <div className="text-sm text-red-400 text-center">{error}</div>
            </div>
          )}

          {/* User profile header with avatar and basic info */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-slate-700/50 border border-slate-600 rounded-2xl">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-white" />
                )}
              </div>
              {/* Camera button for avatar upload - only show when editing */}
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-slate-300 text-lg mb-2">{user?.email}</p>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {formatJoinDate(user?.createdAt)}
              </p>
            </div>
          </div>

          {isEditing ? (
            // Edit profile form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name input field */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    required
                    placeholder="Enter your name"
                    minLength={2}
                  />
                </div>

                {/* Avatar URL input field */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-amber-400" />
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Form action buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl transition-colors font-medium flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Read-only profile view
            <div className="space-y-6">
              {/* Basic information section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-teal-400" />
                    Email Address
                  </label>
                  <p className="text-white text-lg font-medium">{user?.email}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Email cannot be changed
                  </p>
                </div>

                <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl">
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-400" />
                    Full Name
                  </label>
                  <p className="text-white text-lg font-medium">{user?.name}</p>
                </div>
              </div>

              {/* Account information section */}
              <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-slate-400">Member since:</span>
                    <p className="text-white font-medium">{formatJoinDate(user?.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Last updated:</span>
                    <p className="text-white font-medium">{formatJoinDate(user?.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Activity statistics section */}
              <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Activity Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-teal-400">0</div>
                    <div className="text-sm text-slate-400">Tasks Created</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-amber-400">0</div>
                    <div className="text-sm text-slate-400">Tasks Completed</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">0%</div>
                    <div className="text-sm text-slate-400">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">0</div>
                    <div className="text-sm text-slate-400">Active Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;