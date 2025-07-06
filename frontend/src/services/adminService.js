import axios from 'axios';

const API_BASE_URL = '/api/v1';

// Configure axios defaults
const adminAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('accessToken');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Admin CRUD Operations
export const adminService = {
  // Get all admins
  getAllAdmins: async () => {
    const response = await adminAPI.get('/admin');
    return response.data;
  },

  // Get specific admin
  getAdmin: async (adminId) => {
    const response = await adminAPI.get(`/admin/${adminId}`);
    return response.data;
  },

  // Create new admin
  createAdmin: async (adminData) => {
    const response = await adminAPI.post('/admin/', adminData);
    return response.data;
  },

  // Update admin
  updateAdmin: async (adminId, adminData) => {
    const response = await adminAPI.put(`/admin/${adminId}`, adminData);
    return response.data;
  },

  // Delete admin
  deleteAdmin: async (adminId) => {
    const response = await adminAPI.delete(`/admin/${adminId}`);
    return response.data;
  },
};

// User Management
export const userManagementService = {
  // Get all users
  getAllUsers: async () => {
    const response = await adminAPI.get('/user/');
    return response.data;
  },

  // Get specific user
  getUser: async (userId) => {
    const response = await adminAPI.get(`/user/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await adminAPI.put(`/user/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await adminAPI.delete(`/user/${userId}`);
    return response.data;
  },

  // Activate user
  // activateUser: async (userId) => {
  //   const response = await adminAPI.post(`/users/${userId}/activate`);
  //   return response.data;
  // },

  // Deactivate user
  // deactivateUser: async (userId) => {
  //   const response = await adminAPI.post(`/users/${userId}/deactivate`);
  //   return response.data;
  // },
};

// System Settings
// export const settingsService = {
//   // Get system settings
//   getSettings: async () => {
//     const response = await adminAPI.get('/settings');
//     return response.data;
//   },

//   // Update system settings
//   updateSettings: async (settings) => {
//     const response = await adminAPI.put('/settings', settings);
//     return response.data;
//   },
// };

// Dashboard & Analytics
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await adminAPI.get('/admin/dashboard/stats');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await adminAPI.get(`/admin/dashboard/activity?limit=${limit}`); // have to build
    return response.data;
  },
};

// System Health
// export const systemService = {
//   // Get system health
//   getHealth: async () => {
//     const response = await adminAPI.get('/system/health');
//     return response.data;
//   },
// };

// Store Management (Admin View)
// export const storeManagementService = {
//   // Get all stores
//   getAllStores: async () => {
//     const response = await adminAPI.get('/store/');
//     return response.data;
//   },

//   // Get specific store
//   getStore: async (storeId) => {
//     const response = await adminAPI.get(`/store/${storeId}`);
//     return response.data;
//   },
// };

// Product Management (Admin View)
// export const productManagementService = {
//   // Get all products
//   getAllProducts: async () => {
//     const response = await adminAPI.get('/product/');
//     return response.data;
//   },
// };

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    return { error: true, message };
  } else if (error.request) {
    // Network error
    return { error: true, message: 'Network error. Please check your connection.' };
  } else {
    // Other error
    return { error: true, message: error.message || 'An unexpected error occurred' };
  }
}; 