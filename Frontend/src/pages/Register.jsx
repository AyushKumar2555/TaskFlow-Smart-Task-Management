import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff, Sparkles, User, Mail, Lock } from 'lucide-react';

const Register = () => {
  // State to hold user inputs for registration form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State to handle loading spinner when submitting
  const [loading, setLoading] = useState(false);

  // Stores error message if validation fails or API returns error
  const [error, setError] = useState('');

  // States to control visibility of password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth(); // get register function from AuthContext
  const navigate = useNavigate(); // used for redirecting after successful signup

  // Updates form data when user types in input fields
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // If an error is already showing, clear it as soon as user starts typing
    if (error) setError('');
  };

  // Basic form validation before making API call
  const validateForm = () => {
    // Check if any field is empty
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }

    // Name must be at least 2 characters
    if (formData.name.trim().length < 2) {
      return 'Name should be at least 2 characters';
    }

    // Email should contain "@" and "."
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      return 'Please enter a valid email address';
    }

    // Password length check
    if (formData.password.length < 6) {
      return 'Password should be at least 6 characters';
    }

    // Password and confirm password must match
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    return null; // no errors found
  };

  // Runs when the user submits the registration form
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setLoading(true);
    setError('');

    // Run validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending data
      const { confirmPassword, ...registerData } = formData;

      // Call the register function from AuthContext
      const result = await register(registerData);
      
      // If registration successful → redirect to dashboard
      if (result.success) {
        navigate('/dashboard');
      } else {
        // If error → show message
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md animate-scale-in shadow-xl">
        
        {/* Top header with logo and title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent mb-2">
            Join TaskFlow
          </h1>
          <p className="text-slate-400">
            Or{' '}
            <Link
              to="/login"
              className="font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        {/* Registration form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Show error messages if validation fails */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 animate-fade-in">
              <div className="text-sm text-red-400 text-center">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-400" />
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="Enter your full name"
                required
                minLength={2}
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password input with toggle button */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors pr-10"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                {/* Eye icon to show/hide password */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-400" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors pr-10"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
                {/* Eye icon to show/hide confirm password */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Button to submit form */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                {/* Loading spinner while creating account */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Create your account
              </>
            )}
          </button>
        </form>

        {/* Footer with terms text */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-center text-sm text-slate-500">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
