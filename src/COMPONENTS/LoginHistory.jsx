import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyLoginHistory, getMyIPs } from '../REDUX/Slices/loginLogsSlice';

const LoginHistory = () => {
  const dispatch = useDispatch();
  
  const {
    loginHistory,
    loginHistoryLoading,
    loginHistoryError,
    myIPs,
    myIPsLoading
  } = useSelector(state => state.loginLogs);

  useEffect(() => {
    // Fetch both history and IPs on mount
    dispatch(getMyLoginHistory({ page: 1, limit: 10 }));
    dispatch(getMyIPs());
  }, [dispatch]);

  if (loginHistoryLoading) return <div>Loading...</div>;
  if (loginHistoryError) return <div>Error: {loginHistoryError}</div>;

  return (
    <div>
      <h2>Login History</h2>
      
      {loginHistory.map((log) => (
        <div key={log._id} className="login-item">
          <p>
            <strong>{log.browser.name}</strong> on {log.os.name}
          </p>
          <p>IP: {log.ipAddress}</p>
          <p>Device: {log.device}</p>
          <p>Time: {new Date(log.loginTime).toLocaleString()}</p>
          <p>Location: {log.location.city}, {log.location.country}</p>
        </div>
      ))}

      <h3>IPs You've Logged In From</h3>
      {myIPs.map((ip) => (
        <div key={ip._id}>
          <p>{ip._id} - Last login: {new Date(ip.lastLogin).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default LoginHistory;
