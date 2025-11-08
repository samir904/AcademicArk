import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../REDUX/Slices/authslice';

export default function AuthChecker() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);

  useEffect(() => {
    // ✨ Skip auth check if OAuth callback is in progress
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get('googleAuth');
    
    // Don't run during OAuth callback
    if (googleAuth === 'success') {
      console.log('⏭️ Skipping auth check - OAuth in progress');
      return;
    }

    // Only check auth if not logged in
    if (!isLoggedIn) {
      console.log('🔍 Running auth check...');
      dispatch(checkAuth());
    }
  }, []); // Empty dependency - runs once

  return null;
}
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkAuth } from '../REDUX/Slices/authslice';

// export default function AuthChecker() {
//   const dispatch = useDispatch();
//   const { isLoggedIn } = useSelector(state => state.auth);

//   useEffect(() => {
//     // ✅ Only check auth once on app mount if not logged in
//     if (!isLoggedIn) {
//       dispatch(checkAuth());
//     }
//   }, []); // Empty dependency array - runs once

//   return null; // This component doesn't render anything
// }
