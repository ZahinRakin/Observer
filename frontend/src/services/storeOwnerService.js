import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
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

class StoreOwnerService {
  // Dashboard Statistics
  async getDashboardStats(storeOwnerId) {
    try {
      const response = await api.get(`/storeowner/${storeOwnerId}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Store Management
  async getStores(storeOwnerId) {
    try {
      const response = await api.get(`/storeowner/${storeOwnerId}/stores`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  async createStore(storeOwnerId, storeData) {
    try {
      const response = await api.post(`/storeowner/${storeOwnerId}/stores`, storeData);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  }

  async updateStore(storeOwnerId, storeId, storeData) {
    try {
      const response = await api.put(`/storeowner/${storeOwnerId}/stores/${storeId}`, storeData);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  }

  async deleteStore(storeOwnerId, storeId) {
    try {
      const response = await api.delete(`/storeowner/${storeOwnerId}/stores/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  }

  // Product Management
  async getStoreProducts(storeOwnerId, storeId) {
    try {
      const response = await api.get(`/storeowner/${storeOwnerId}/stores/${storeId}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store products:', error);
      throw error;
    }
  }

  async createProduct(storeOwnerId, storeId, productData) {
    try {
      const response = await api.post(`/storeowner/${storeOwnerId}/stores/${storeId}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/product/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(storeOwnerId, storeId, productId) {
    try {
      const response = await api.delete(`/storeowner/${storeOwnerId}/stores/${storeId}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // News Management
  async getStoreOwnerNews(storeOwnerId) {
    try {
      const response = await api.get(`/storeowner/${storeOwnerId}/news`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store owner news:', error);
      throw error;
    }
  }

  async createNews(storeOwnerId, newsData) {
    try {
      const response = await api.post(`/storeowner/${storeOwnerId}/news`, newsData);
      return response.data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  async updateNews(newsId, newsData) {
    try {
      const response = await api.put(`/news/${newsId}`, newsData);
      return response.data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  async deleteNews(newsId) {
    try {
      const response = await api.delete(`/news/${newsId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }

  // Product-specific News Management
  async getProductNews(productId) {
    try {
      console.log('🔍 DEBUG - getProductNews called with productId:', productId);
      console.log('🔍 DEBUG - Making request to:', `/news/product/${productId}`);
      
      const response = await api.get(`/news/product/${productId}`);
      console.log('🔍 DEBUG - getProductNews response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching product news:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  async createProductNews(storeOwnerId, productId, newsData) {
    console.log('🚀 createProductNews called with:', { storeOwnerId, productId, newsData });
    
    try {
      // Use the product field from newsData if it exists, otherwise use the provided productId
      const { title, description, product } = newsData;
      const requestData = {
        product: product || productId,
        title,
        description
      };
      
      console.log('🔍 DEBUG - createProductNews request data:', requestData);
      console.log('🔍 DEBUG - storeOwnerId:', storeOwnerId);
      console.log('🔍 DEBUG - productId:', productId);
      console.log('🔍 DEBUG - newsData:', newsData);
      console.log('🔍 DEBUG - Final requestData:', requestData);
      
      const response = await api.post(`/storeowner/${storeOwnerId}/news`, requestData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating product news:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  }

  // Store Owner Profile
  async getStoreOwner(storeOwnerId) {
    try {
      const response = await api.get(`/storeowner/${storeOwnerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store owner:', error);
      throw error;
    }
  }

  async updateStoreOwner(storeOwnerId, storeOwnerData) {
    try {
      const response = await api.put(`/storeowner/${storeOwnerId}`, storeOwnerData);
      return response.data;
    } catch (error) {
      console.error('Error updating store owner:', error);
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

export default new StoreOwnerService(); 