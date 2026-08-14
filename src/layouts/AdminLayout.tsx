import { useState, useEffect, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Calendar,
  Users,
  Stethoscope,
  CalendarOff,
  ImageIcon,
  Star,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  usePendingAppointmentsCount,
  useUnreadMessagesCount,
} from '@/hooks/useAdminData';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import UserMenu from '@/components/admin/UserMenu';

const sidebarSections = [
  {
    section: 'Overview',
    links: [{ path: '/admin', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    section: 'Management',
    links: [
      {
        path: '/admin/appointments',
        icon: Calendar,
        label: 'Appointments',
        badgeKey: 'appointments',
      },
      {
        path: '/admin/messages',
        icon: MessageSquare,
        label: 'Messages',
        badgeKey: 'messages',
      },
      { path: '/admin/doctors', icon: Users, label: 'Doctors' },
      { path: '/admin/services', icon: Stethoscope, label: 'Services' },
      { path: '/admin/holidays', icon: CalendarOff, label: 'Holidays' },
    ],
  },
  {
    section: 'Content',
    links: [
      { path: '/admin/banners', icon: Image, label: 'Banners' },
      { path: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
      { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
      { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    ],
  },
  {
    section: 'System',
    links: [{ path: '/admin/settings', icon: Settings, label: 'Settings' }],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated, token } = useAuthStore();

  // Notification hooks
  const { data: pendingAppointments = 0 } = usePendingAppointmentsCount();
  const { data: unreadMessages = 0 } = useUnreadMessagesCount();

  // Total notification count
  const totalNotifications = pendingAppointments + unreadMessages;

  // Badge counts map
  const badgeCounts = useMemo(
    () => ({
      appointments: pendingAppointments,
      messages: unreadMessages,
    }),
    [pendingAppointments, unreadMessages]
  );

  // Auth check
  useEffect(() => {
    const storedToken = localStorage.getItem('kay-dental-token');
    if (!isAuthenticated || !token || !storedToken) {
      console.warn('🔒 Not authenticated, redirecting to login');
      logout();
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, token, navigate, logout]);

  // Update browser tab title
  useEffect(() => {
    const baseTitle = 'KAY Admin';
    if (totalNotifications > 0) {
      document.title = `(${totalNotifications}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    return () => {
      document.title = baseTitle;
    };
  }, [totalNotifications]);

  if (!isAuthenticated || !token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    const allLinks = sidebarSections.flatMap((s) => s.links);
    const currentLink = allLinks.find(
      (l) => l.path === path || (l.path !== '/admin' && path.startsWith(l.path))
    );
    return currentLink?.label || 'Admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm shadow-sm shadow-green-500/25 group-hover:scale-105 transition-transform">
              K
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-none">
                KAY Admin
              </div>
              <div className="mt-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Dashboard
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.section}>
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {section.section}
              </h3>
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== '/admin' &&
                      location.pathname.startsWith(link.path));
                  const Icon = link.icon;
                  const badge =
                    'badgeKey' in link
                      ? badgeCounts[link.badgeKey as keyof typeof badgeCounts]
                      : 0;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-green-50 text-green-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-green-600'
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="flex-1">{link.label}</span>

                      {/* Notification badge - always red */}
                      {badge > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-sm">
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}

                      {/* Active indicator - always show when active */}
                      {isActive && (
                        <div className="w-1 h-4 rounded-full bg-green-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-1 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-green-700 transition-colors group"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            <span className="font-medium">View Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full group"
          >
            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center px-4 lg:px-8 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              {getCurrentPageTitle()}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification Dropdown */}
            <NotificationDropdown
              isOpen={notifOpen}
              onToggle={() => {
                setNotifOpen(!notifOpen);
                setUserMenuOpen(false);
              }}
              onClose={() => setNotifOpen(false)}
              totalCount={totalNotifications}
            />

            {/* User Menu */}
            <UserMenu
              isOpen={userMenuOpen}
              onToggle={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotifOpen(false);
              }}
              onClose={() => setUserMenuOpen(false)}
              onLogout={handleLogout}
              user={user}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}