import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface UserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  user: {
    username?: string;
    role?: string;
  } | null;
}

export default function UserMenu({
  isOpen,
  onToggle,
  onClose,
  onLogout,
  user,
}: UserMenuProps) {
  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm shadow-sm">
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-gray-900 leading-none">
            {user?.username}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
            {user?.role}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg py-1 z-40">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">
                {user?.username}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{user?.role}</div>
            </div>
            <Link
              to="/admin/settings"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
              View Website
            </Link>
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}