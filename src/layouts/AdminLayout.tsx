import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Image, Calendar, Users, Stethoscope,
  CalendarOff, ImageIcon, Star, HelpCircle, Settings, LogOut,
  Menu, X, ChevronLeft, MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const sidebarLinks = [
  { path: '/admin',              icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { path: '/admin/appointments', icon: <Calendar className="w-5 h-5" />,        label: 'Appointments' },
  { path: '/admin/messages',     icon: <MessageSquare className="w-5 h-5" />,   label: 'Messages' },
  { path: '/admin/banners',      icon: <Image className="w-5 h-5" />,           label: 'Banners' },
  { path: '/admin/doctors',      icon: <Users className="w-5 h-5" />,           label: 'Doctors' },
  { path: '/admin/services',     icon: <Stethoscope className="w-5 h-5" />,     label: 'Services' },
  { path: '/admin/holidays',     icon: <CalendarOff className="w-5 h-5" />,     label: 'Holidays' },
  { path: '/admin/gallery',      icon: <ImageIcon className="w-5 h-5" />,       label: 'Gallery' },
  { path: '/admin/testimonials', icon: <Star className="w-5 h-5" />,            label: 'Testimonials' },
  { path: '/admin/faqs',         icon: <HelpCircle className="w-5 h-5" />,      label: 'FAQs' },
  { path: '/admin/settings',     icon: <Settings className="w-5 h-5" />,        label: 'Settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('kay-dental-token');
    if (!isAuthenticated || !token || !storedToken) {
      console.warn('🔒 Not authenticated, redirecting to login');
      logout();
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, token, navigate, logout]);

  if (!isAuthenticated || !token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-bold text-gray-900">KAY Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-3">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user?.username}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}