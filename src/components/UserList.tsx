// frontend/src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import { apiService, type AppUser } from '../services/api';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please log in to view users');
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setError(null);
      console.log('Fetching employees...');
      const employeeData = await apiService.getEmployees();
      console.log('Received employees:', employeeData);
      setUsers(employeeData);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view employees');
        localStorage.removeItem('authToken'); // Clear invalid token
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view employees');
      } else {
        setError(`Failed to fetch employees: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div style={{ color: 'red' }}>Please log in to access this page</div>;
  }

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Employees ({users.length})</h2>
      {users.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <strong>{user.displayName}</strong> ({user.role}) - {user.email}
              {user.department && <span> - {user.department}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;