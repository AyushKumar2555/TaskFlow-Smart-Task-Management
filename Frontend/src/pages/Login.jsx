import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff, Sparkles, User, Lock } from 'lucide-react';

const Login = () => {
  // State variables to store user input and UI behavior
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // shows loading state when signing in
  const [error, setError] = useState(''); // stores error messages
  const [showPassword, setShowPassword] = useState(false); // toggle for showing/hiding password

  const { login } = useAuth(); // custom auth hook
  const navigate = useNavigate(); // for redirecting user after login

  // Function runs when user submits the login form
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops page refresh
    setLoading(true);
    setError('');

    // Check if email or password is empty
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Check if email looks valid
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Call login function
    const result = await login(email, password);
    
    // If login successful → go to dashboard
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Otherwise show error
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Pre-fills demo email and password
  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md animate-scale-in shadow-xl">
        
        {/* Top section with logo and title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400">
            Or{' '}
            <Link
              to="/register"
              className="font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Show error if something goes wrong */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="text-sm text-red-400 text-center">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            
            {/* Email input field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-400" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password input field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} // toggle password visibility
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors pr-10"
                  placeholder="Enter your password"
                  required
                />
                {/* Button to show/hide password */}
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
            </div>
          </div>

          {/* Sign-in button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                {/* Spinner while loading */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign in to TaskFlow
              </>
            )}
          </button>

          {/* Button for using demo login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Use demo credentials
            </button>
          </div>

          {/* Show demo credentials info */}
          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>Demo Email: demo@example.com</p>
            <p>Demo Password: password</p>
          </div>
        </form>

        {/* Footer text */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-center text-sm text-slate-500">
            Secure authentication powered by TaskFlow
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
