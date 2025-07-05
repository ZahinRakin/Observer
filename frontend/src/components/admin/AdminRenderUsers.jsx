import React, { useState, useEffect } from 'react';
import { userManagementService, handleAPIError } from '../../services/adminService.js';

const AdminRenderUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userManagementService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole || user.account_type === filterRole;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  };

  const handleUserAction = async (action, userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      let result;
      switch (action) {
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            result = await userManagementService.deleteUser(userId);
            setUsers(prev => prev.filter(user => user.id !== userId));
          }
          break;
        case 'activate':
          result = await userManagementService.activateUser(userId);
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'active' } : user
          ));
          break;
        case 'deactivate':
          result = await userManagementService.deactivateUser(userId);
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: 'inactive' } : user
          ));
          break;
        default:
          break;
      }
      
      if (result) {
        console.log(`${action} result:`, result);
      }
    } catch (err) {
      const errorInfo = handleAPIError(err);
      alert(`Failed to ${action} user: ${errorInfo.message}`);
      console.error(`${action} user error:`, err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-900/50 text-red-300 border border-red-700/30';
      case 'storeowner': return 'bg-blue-900/50 text-blue-300 border border-blue-700/30';
      case 'customer': return 'bg-green-900/50 text-green-300 border border-green-700/30';
      default: return 'bg-gray-700/50 text-gray-300 border border-gray-600/30';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'bg-green-900/50 text-green-300 border border-green-700/30' : 'bg-red-900/50 text-red-300 border border-red-700/30';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
            <div className="mt-6">
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-900/20 border border-red-700/50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-red-400 text-xl">⚠️</div>
            <div>
              <h3 className="text-red-300 font-semibold">Error Loading Users</h3>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">User Management</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white"
            >
              <option value="all" className="bg-gray-800 text-white">All Roles</option>
              <option value="admin" className="bg-gray-800 text-white">Admin</option>
              <option value="storeowner" className="bg-gray-800 text-white">Store Owner</option>
              <option value="customer" className="bg-gray-800 text-white">Customer</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700/30 border border-gray-600/50 rounded-lg">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.username || 'N/A'}</div>
                      <div className="text-sm text-gray-400">{user.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role || user.account_type)}`}>
                      {user.role || user.account_type || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                      {user.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(user.created_at || user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
                        disabled={actionLoading[user.id]}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleUserAction('delete', user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                        disabled={actionLoading[user.id]}
                      >
                        {actionLoading[user.id] ? 'Deleting...' : 'Delete'}
                      </button>
                      <button 
                        onClick={() => handleUserAction(
                          user.status === 'active' ? 'deactivate' : 'activate', 
                          user.id
                        )}
                        className={`transition-colors duration-200 disabled:opacity-50 ${
                          user.status === 'active' 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                        disabled={actionLoading[user.id]}
                      >
                        {actionLoading[user.id] ? 'Processing...' : 
                         user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {users.length === 0 ? 'No users found in the system.' : 'No users found matching your criteria.'}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-600/50">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Total Users: {users.length}</span>
            <span>Filtered Results: {filteredUsers.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRenderUsers; 