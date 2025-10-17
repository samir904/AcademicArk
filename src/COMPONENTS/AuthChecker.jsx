import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../REDUX/Slices/authslice';

export default function AuthChecker() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    // ✅ Only check auth once on app mount if not logged in
    if (!isLoggedIn) {
      dispatch(checkAuth());
    }
  }, []); // Empty dependency array - runs once

  return null; // This component doesn't render anything
}
