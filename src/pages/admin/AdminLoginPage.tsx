import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast.success('Welcome back!');
        navigate('/admin');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-yellow-100/40 blur-3xl" />
      </div>

      {/* Back to site link */}
      <div className="relative">
        <Link
          to="/"
          className="fixed top-6 left-6 z-10 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-green-300 hover:text-green-700 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center"
            >
              <img 
                src="/logo.png" 
                alt="KAY Dental Care" 
                className="w-full h-full object-contain"
                width={80}
                height={80}
              />
            </motion.div>

            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700 mb-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Portal
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage KAY Dental Care
            </p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-xl shadow-gray-200/50"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="admin"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Demo Credentials
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* Demo credentials info */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Username
                  </div>
                  <div className="mt-1 font-mono text-gray-900 font-semibold">
                    admin
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Password
                  </div>
                  <div className="mt-1 font-mono text-gray-900 font-semibold">
                    admin123
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} KAY Dental Care. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Secure admin access · Protected by authentication
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}