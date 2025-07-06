import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import LoadingAnimation from '../Loading.jsx';
import ProductCard from '../cards/ProductCard.jsx';
import axios from 'axios';

const RenderProducts = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('subscribed');
  const [showNews, setShowNews] = useState(false);
  const [selectedProductForNews, setSelectedProductForNews] = useState(null);
  const [productNews, setProductNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // Debug component mount
  useEffect(() => {
    console.log('🔍 DEBUG - RenderProducts component mounted');
    console.log('🔍 DEBUG - Initial user state:', user);
    console.log('🔍 DEBUG - VITE_API_URL:', import.meta.env.VITE_API_URL);
    
    return () => {
      console.log('🔍 DEBUG - RenderProducts component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('🔍 CustomerRenderProducts - useEffect triggered with user?.id:', user?.id);
    console.log('🔍 DEBUG - User object in useEffect:', user);
    console.log('🔍 DEBUG - User ID type:', typeof user?.id);
    console.log('🔍 DEBUG - User ID value:', user?.id);
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 DEBUG - Fetching products for user:', user?.id);
        console.log('🔍 DEBUG - API URL:', import.meta.env.VITE_API_URL);
        
        // Don't return early if no user - let the API handle it
        // This might be causing the issue
        
        // Test API connectivity first
        try {
          console.log('🔍 DEBUG - Testing API connectivity...');
          const testResponse = await axios.get(`/api/v1/healthcheck/`, {
            timeout: 5000
          });
          console.log('🔍 DEBUG - API connectivity test successful:', testResponse.status);
        } catch (testErr) {
          console.error('❌ API connectivity test failed:', testErr.message);
          // Don't throw here, continue with the main requests
        }
        
        // Make both requests regardless of user state
        const requests = [];
        
        // Only fetch user-specific products if user ID exists
        if (user?.id) {
          requests.push(
            axios.get(`/api/v1/product/customer/${user.id}`, {
              timeout: 10000
            })
          );
        } else {
          // If no user, set empty array for subscribed products
          requests.push(Promise.resolve({ data: [] }));
        }
        
        // Always fetch all products
        requests.push(
          axios.get(`/api/v1/product/`, {
            timeout: 10000
          })
        );

        console.log('🔍 DEBUG - Making API requests...');
        const [realProductsResponse, realAllProductsResponse] = await Promise.all(requests);

        // Extract data from axios responses and ensure they are arrays
        const realProducts = Array.isArray(realProductsResponse.data) ? realProductsResponse.data : [];
        const realAllProducts = Array.isArray(realAllProductsResponse.data) ? realAllProductsResponse.data : [];

        console.log('🔍 DEBUG - Fetched products:', { 
          subscribedCount: realProducts.length, 
          allCount: realAllProducts.length,
          subscribedProducts: realProducts,
          allProducts: realAllProducts
        });

        setProducts(realProducts);
        setAllProducts(realAllProducts);
        
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        console.error('❌ Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            timeout: err.config?.timeout
          }
        });
        
        // More specific error handling
        if (err.code === 'ECONNREFUSED') {
          setError('Backend server is not running. Please check if the server is started.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please check your internet connection.');
        } else if (err.response?.status === 404) {
          setError('API endpoint not found. Please check the backend routes.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response?.data?.detail || err.message || 'Failed to fetch products');
        }
        
        // Set empty arrays as fallback
        setProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    console.log('🔍 DEBUG - Calling fetchProducts');
    fetchProducts();
  }, [user?.id]); // Make sure this dependency is correct

  console.log('🔍 DEBUG - Current component state:', {
    loading,
    error,
    productsLength: products.length,
    allProductsLength: allProducts.length,
    activeTab,
    user: user?.id,
    searchTerm
  });

  const handleUnsubscribe = async (productId) => {
    try {
      console.log('🔍 DEBUG - Unsubscribing from product:', productId);
      
      if (!user?.id) {
        console.error('❌ No user ID available for unsubscribe');
        setError('User not logged in');
        return;
      }

      console.log('🔍 DEBUG - Making unsubscribe request to:', `/api/v1/product/unsubscribe/${user.id}/${productId}`);

      // Make API call to unsubscribe
      const response = await axios.post(`/api/v1/product/unsubscribe/${user.id}/${productId}`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('🔍 DEBUG - Unsubscribe successful:', response.data);
      
      // Update local state after successful API call
      setProducts(prev => (prev || []).filter(p => p && p._id !== productId));
      
      // Add the product back to all products if it's not already there
      const unsubscribedProduct = products.find(p => p && p._id === productId);
      if (unsubscribedProduct && !allProducts.some(p => p._id === productId)) {
        setAllProducts(prev => [...(prev || []), unsubscribedProduct]);
      }
      
    } catch (err) {
      console.error('❌ Error unsubscribing from product:', err);
      console.error('❌ Unsubscribe error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      
      // Set more specific error message
      if (err.response?.status === 404) {
        setError('Unsubscribe endpoint not found');
      } else if (err.response?.status >= 500) {
        setError('Server error during unsubscribe');
      } else {
        setError(err.response?.data?.detail || 'Failed to unsubscribe');
      }
    }
  };

  const handleSubscribe = async (productId) => {
    try {
      console.log('🔍 DEBUG - Subscribing to product:', productId);
      
      if (!user?.id) {
        console.error('❌ No user ID available for subscribe');
        setError('User not logged in');
        return;
      }

      console.log('🔍 DEBUG - Making subscribe request to:', `/api/v1/product/subscribe/${user.id}/${productId}`);

      // Make API call to subscribe
      const response = await axios.post(`/api/v1/product/subscribe/${user.id}/${productId}`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('🔍 DEBUG - Subscribe successful:', response.data);
      
      // Update local state after successful API call
      const productToSubscribe = (allProducts || []).find(p => p && p._id === productId);
      if (productToSubscribe) {
        setProducts(prev => [...(prev || []), productToSubscribe]);
        setAllProducts(prev => (prev || []).filter(p => p && p._id !== productId));
      }
      
    } catch (err) {
      console.error('❌ Error subscribing to product:', err);
      console.error('❌ Subscribe error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      
      // Set more specific error message
      if (err.response?.status === 404) {
        setError('Subscribe endpoint not found');
      } else if (err.response?.status >= 500) {
        setError('Server error during subscribe');
      } else {
        setError(err.response?.data?.detail || 'Failed to subscribe');
      }
    }
  };

  const handleViewAllNews = async (product) => {
    setShowNews(true);
    setSelectedProductForNews(product);
    setProductNews([]);
    setNewsLoading(true);
    setNewsError(null);
    try {
      // Fetch news for the product (GET /api/v1/news/product/:productId)
      const response = await axios.get(`/api/v1/news/product/${product._id || product.id}`);
      setProductNews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setNewsError(err.response?.data?.detail || err.message || 'Failed to fetch news');
      setProductNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleBackToProducts = () => {
    setShowNews(false);
    setSelectedProductForNews(null);
    setProductNews([]);
    setNewsError(null);
  };

  // Filter products based on search term
  const filteredProducts = (products || []).filter(product =>
    product && 
    (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(product.tags) && product.tags.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))))
  );

  const filteredAllProducts = (allProducts || []).filter(product =>
    product && 
    (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(product.tags) && product.tags.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))))
  );

  if (loading) return <LoadingAnimation />;
  if (error) return (
    <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
      <h3 className="font-bold mb-2">Error:</h3>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
      >
        Retry
      </button>
    </div>
  );

  if (showNews && selectedProductForNews) {
    // Debug: log productNews
    console.log('CustomerRenderProducts - Rendering news:', productNews);
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20 shadow-lg">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            News for {selectedProductForNews.name}
          </h1>
          <p className="text-gray-300 mb-2">All news published for this product</p>
          <button
            onClick={handleBackToProducts}
            className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
          >
            Back to Products
          </button>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          {newsLoading ? (
            <div className="text-center text-gray-400">Loading news...</div>
          ) : newsError ? (
            <div className="text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h3 className="font-bold mb-2">Error:</h3>
              <p>{newsError}</p>
              <button 
                onClick={() => handleViewAllNews(selectedProductForNews)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Retry
              </button>
            </div>
          ) : Array.isArray(productNews) && productNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No news found</h3>
              <p className="text-gray-400 mb-4">No news has been published for this product yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">All News ({productNews.length})</h2>
              <div className="grid gap-4">
                {productNews.map(news => (
                  <div key={news.id || news._id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-white mb-2">{news.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{news.description}</p>
                      <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Published: {news.created_at ? new Date(news.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                        {news.updated_at && news.updated_at !== news.created_at && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Updated: {new Date(news.updated_at).toLocaleDateString()}
                          </span>
                        )}
                        {news.author_name && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            By: {news.author_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20 shadow-lg">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Product Management
        </h1>
        <p className="text-gray-300">Discover and manage your product subscriptions</p>
        {user?.id && (
          <p className="text-sm text-gray-400 mt-1">User ID: {user.id}</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50 backdrop-blur-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products by name, description, category, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50 backdrop-blur-sm">
        <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('subscribed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscribed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            My Subscriptions ({(products || []).length})
          </button>
          <button
            onClick={() => setActiveTab('All')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            All ({(allProducts || []).length})
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'subscribed' ? (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-200">Your Subscribed Products</h2>
                <p className="text-gray-400">Manage your product subscriptions and stay updated</p>
              </div>
              <div className="text-sm text-gray-400">
                {filteredProducts.length} of {(products || []).length} products
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by subscribing to some products.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product._id}
                    product={product}
                    onUnsubscribe={handleUnsubscribe}
                    onViewAllNews={handleViewAllNews}
                    onSubscribe={handleSubscribe}
                    isSubscribed={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-200">All Products</h2>
                <p className="text-gray-400">Discover products you might be interested in</p>
              </div>
              <div className="text-sm text-gray-400">
                {filteredAllProducts.length} of {(allProducts || []).length} products
              </div>
            </div>
            
            {filteredAllProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No recommendations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new recommendations.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAllProducts.map(product => (
                  <div key={product._id} className="bg-gray-700/50 rounded-lg shadow-md border border-gray-600/50 overflow-hidden backdrop-blur-sm">
                    <img
                      src={product.image || "/dummy_product.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs border border-blue-700/50">
                          {product.category}
                        </span>
                        {product.tags?.map((tag, idx) => (
                          <span key={idx} className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded text-xs border border-gray-500/50">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <span>Store: {product.store}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubscribe(product._id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium shadow-lg"
                        >
                          Subscribe
                        </button>
                        <button
                          onClick={() => handleViewAllNews(product)}
                          className="bg-gray-600/50 text-gray-300 py-2 px-3 rounded hover:bg-gray-600 transition-colors text-sm border border-gray-500/50"
                        >
                          View News
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderProducts;