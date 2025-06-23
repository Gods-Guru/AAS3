import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // If not logged in (no token), redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If not verified and not admin, redirect to verify
  if (user && !user.isVerified && !user.isAdmin) {
    return <Navigate to="/verify-otp" />;
  }

  // If adminOnly route and not admin, redirect to user welcome
  if (adminOnly && user && !user.isAdmin) {
    return <Navigate to="/user/welcome" />;
  }

  return children;
};

export default PrivateRoute;