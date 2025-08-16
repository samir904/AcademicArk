// src/hooks/useAuth.js
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../HELPERS/Toaster';

export const useAuth = () => {
  const user = useSelector(state => state.auth.data);
  const navigate = useNavigate();

  const requireAuth = (action = "perform this action") => {
    if (!user) {
      showToast.error(`Please login to ${action}`);
      navigate('/login');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated: !!user,
    requireAuth
  };
};
