import api from '../utils/api';

class UserService {
  async updateUser(userId, userData) {
    try {
      console.log('🔍 DEBUG - updateUser called with:', { userId, userData });
      
      // Determine the user type and use appropriate endpoint
      const accountType = userData.account_type;
      let response;
      
      if (accountType === 'storeowner') {
        // Use store owner endpoint
        response = await api.put(`/storeowner/${userId}`, userData);
      } else if (accountType === 'customer') {
        // Use customer endpoint for customers
        response = await api.put(`/customer/${userId}`, userData);
      } else {
        // Use general user endpoint for other types
        response = await api.put(`/user/${userId}`, userData);
      }
      
      console.log('🔍 DEBUG - updateUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  async getUserDetails(userId) {
    try {
      console.log('🔍 DEBUG - getUserDetails called with userId:', userId);
      const response = await api.get(`/user/${userId}`);
      console.log('🔍 DEBUG - getUserDetails response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      console.log('🔍 DEBUG - deleteUser called with userId:', userId);
      const response = await api.delete(`/user/${userId}`);
      console.log('🔍 DEBUG - deleteUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  // Test Connection
  async testConnection() {
    try {
      const response = await api.get('/healthcheck');
      return {
        success: true,
        message: 'Backend connection successful',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Backend connection failed',
        error: error.message
      };
    }
  }
}

export default new UserService(); 