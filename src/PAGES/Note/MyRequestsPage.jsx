import { useDispatch } from 'react-redux';
import { getMyRequests } from '../../REDUX/Slices/requestSlice';
import { useEffect } from 'react';

export default function MyRequestsPage() {
  const dispatch = useDispatch();
  const { myRequests, loading, pagination } = useSelector((state) => state.request);
  const [filters, setFilters] = useState({
    status: '',  // 'PENDING', 'FULFILLED', 'REJECTED'
    page: 1
  });

  useEffect(() => {
    // Fetch my requests on mount
    dispatch(getMyRequests({
      status: filters.status,
      page: filters.page
    }));
  }, [filters.status, filters.page, dispatch]);

  return (
    <div>
      <h1>My Requests</h1>
      
      {/* Status Filter */}
      <div className="mb-4">
        <button 
          onClick={() => setFilters({ ...filters, status: '', page: 1 })}
          className={filters.status === '' ? 'active' : ''}
        >
          All
        </button>
        <button 
          onClick={() => setFilters({ ...filters, status: 'PENDING', page: 1 })}
          className={filters.status === 'PENDING' ? 'active' : ''}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilters({ ...filters, status: 'FULFILLED', page: 1 })}
          className={filters.status === 'FULFILLED' ? 'active' : ''}
        >
          Fulfilled
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading your requests...</p>}

      {/* Requests List */}
      {!loading && myRequests.map((request) => (
        <div key={request._id} className="bg-white/10 p-4 rounded-lg mb-3">
          <h3>{request.subject}</h3>
          <p>Status: <span className="badge">{request.status}</span></p>
          <p>Type: {request.requestType}</p>
          <p>Semester {request.semester} - {request.branch}</p>
          {request.status === 'FULFILLED' && (
            <div className="mt-2 p-2 bg-green-500/20 rounded">
              ✓ This material has been added! Check your notes.
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {pagination && (
        <div className="mt-4">
          {pagination.currentPage > 1 && (
            <button onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}>
              ← Previous
            </button>
          )}
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          {pagination.currentPage < pagination.totalPages && (
            <button onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}>
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
