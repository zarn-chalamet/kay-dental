import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Check both isAuthenticated flag AND token existence
  const isLoggedIn = isAuthenticated && token && localStorage.getItem('kay-dental-token');

  if (!isLoggedIn) {
    // Redirect to login, save the attempted URL to redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}