import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import StoreCard from '../cards/StoreCard.jsx';
import StoreForm from '../forms/StoreForm.jsx';
import ProductForm from '../forms/ProductForm.jsx';
import ProductCard from '../cards/ProductCard.jsx';
import NewsCardModal from '../modals/NewsCardModal.jsx';
import NewsForm from '../forms/NewsForm.jsx';
import storeOwnerService from '../../services/storeOwnerService.js';

const StoreOwnerRenderStores = ({ user }) => {
  const { user: contextUser, setUser } = useContext(UserContext);
  // Use contextUser if user prop is not provided
  const currentUser = user || contextUser;
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedProductForNews, setSelectedProductForNews] = useState(null);
  const [productNews, setProductNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Debug: Log user objects to see what's being passed
  console.log('StoreOwnerRenderStores - user prop:', user);
  console.log('StoreOwnerRenderStores - contextUser:', contextUser);
  console.log('StoreOwnerRenderStores - currentUser:', currentUser);

  useEffect(() => {
    const fetchStores = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedStores = await storeOwnerService.getStores(currentUser.id);
        setStores(fetchedStores);
        setError(null);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores');
        // Use fallback data if API fails
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [currentUser?.id, refreshTrigger]);

  const handleCreateStore = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  const handleGoBack = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleSubmit = async (form) => {
    try {
      console.log('🔍 DEBUG - handleSubmit called with form:', form);
      console.log('🔍 DEBUG - editingStore:', editingStore);
      console.log('🔍 DEBUG - currentUser.id:', currentUser?.id);
      
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      if (editingStore) {
        // Update existing store
        const storeId = editingStore.id || editingStore._id;
        console.log('🔍 DEBUG - Updating store with ID:', storeId);
        await storeOwnerService.updateStore(currentUser.id, storeId, form);
      } else {
        // Create new store
        await storeOwnerService.createStore(currentUser.id, form);
      }
      
      setShowForm(false);
      setEditingStore(null);
      
      // Trigger refresh to update the UI
      setRefreshTrigger(prev => prev + 1);
      setError(null);
    } catch (err) {
      console.error('Error saving store:', err);
      setError('Failed to save store: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateStore = (store) => {
    console.log('🔍 DEBUG - handleUpdateStore called with store:', store);
    setEditingStore(store);
    setShowForm(true);
    console.log('🔍 DEBUG - Set editingStore and showForm to true');
  };

  const handleDeleteStore = async (store) => {
    try {
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const storeId = store.id || store._id;
      await storeOwnerService.deleteStore(currentUser.id, storeId);
      
      // Trigger refresh to update the UI
      setRefreshTrigger(prev => prev + 1);
      setError(null);
    } catch (err) {
      console.error('Error deleting store:', err);
      setError('Failed to delete store: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleViewProducts = async (store) => {
    try {
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      console.log('Store object:', store); // Debug log
      const storeId = store.id || store._id;
      console.log('Store ID:', storeId); // Debug log
      
      if (!storeId) {
        setError('Store ID not found');
        return;
      }

      const products = await storeOwnerService.getStoreProducts(currentUser.id, storeId);
      setSelectedStore({ ...store, products });
      setShowProducts(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching store products:', err);
      setError('Failed to load store products: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCloseProducts = () => {
    setShowProducts(false);
    setSelectedStore(null);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleAddProductFromStore = (store) => {
    // First view the store's products, then show the add product form
    handleViewProducts(store);
    // Set a flag to show product form after products load
    setTimeout(() => {
      setEditingProduct(null);
      setShowProductForm(true);
    }, 100);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancelProduct = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (form) => {
    try {
      if (!currentUser?.id || !selectedStore) {
        setError('User ID or store not found. Please try again.');
        return;
      }

      const storeId = selectedStore.id || selectedStore._id;
      
      if (editingProduct) {
        // Update existing product
        const productId = editingProduct.id || editingProduct._id;
        console.log('🔍 DEBUG - handleSubmitProduct - editingProduct:', editingProduct);
        console.log('🔍 DEBUG - handleSubmitProduct - productId:', productId);
        
        const updatedProduct = await storeOwnerService.updateProduct(productId, form);
        // Update the selectedStore with the updated product
        setSelectedStore(prev => ({
          ...prev,
          products: prev.products.map(p => (p.id || p._id) === productId ? updatedProduct : p)
        }));
      } else {
        // Create new product
        const newProduct = await storeOwnerService.createProduct(currentUser.id, storeId, form);
        // Update the selectedStore with the new product
        setSelectedStore(prev => ({
          ...prev,
          products: [newProduct, ...prev.products]
        }));
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (!currentUser?.id || !selectedStore) {
        setError('User ID or store not found. Please try again.');
        return;
      }

      const storeId = selectedStore.id || selectedStore._id;
      await storeOwnerService.deleteProduct(currentUser.id, storeId, productId);
      
      // Update the selectedStore immediately
      setSelectedStore(prev => ({
        ...prev,
        products: prev.products.filter(p => p._id !== productId)
      }));
      
      // Also update the stores list
      setStores(prev => prev.map(store => 
        (store.id || store._id) === storeId
          ? { ...store, products: store.products.filter(p => p._id !== productId) }
          : store
      ));
      
      setError(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateProduct = (product) => {
    console.log('🔍 DEBUG - handleUpdateProduct called with product:', product);
    console.log('🔍 DEBUG - handleUpdateProduct - product.id:', product.id);
    console.log('🔍 DEBUG - handleUpdateProduct - product._id:', product._id);
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handlePublishNews = async (product) => {
    try {
      console.log('🔍 DEBUG - handlePublishNews called with product:', product);
      console.log('🔍 DEBUG - handlePublishNews - product.id:', product.id);
      console.log('🔍 DEBUG - handlePublishNews - product._id:', product._id);
      setSelectedProductForNews(product);
      setEditingNews(null);
      setShowNewsForm(true);
    } catch (err) {
      console.error('Error opening news form:', err);
      setError('Failed to open news form: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleViewAllNews = async (product) => {
    try {
      console.log('🔍 DEBUG - handleViewAllNews called with product:', product);
      console.log('🔍 DEBUG - currentUser.id:', currentUser?.id);
      
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const productId = product.id || product._id;
      console.log('🔍 DEBUG - Using productId:', productId);
      
      setSelectedProductForNews(product);
      console.log('🔍 DEBUG - About to call getProductNews with productId:', productId);
      
      const news = await storeOwnerService.getProductNews(productId);
      console.log('🔍 DEBUG - Received news from backend:', news);
      
      setProductNews(news);
      setShowNewsModal(true);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching product news:', err);
      console.error('❌ Error response:', err.response?.data);
      setError('Failed to load product news: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCloseNewsForm = () => {
    setShowNewsForm(false);
    setEditingNews(null);
    // If we were editing news from the modal, return to the modal view
    if (selectedProductForNews && productNews.length > 0) {
      setShowNewsModal(true);
    }
    // Don't reset selectedProductForNews so user can easily reopen the form
  };

  const handleCloseNewsModal = () => {
    setShowNewsModal(false);
    setSelectedProductForNews(null);
    setProductNews([]);
  };

  const handleSubmitNews = async (form) => {
    try {
      console.log('🔍 DEBUG - handleSubmitNews called with form:', form);
      console.log('🔍 DEBUG - selectedProductForNews:', selectedProductForNews);
      console.log('🔍 DEBUG - currentUser.id:', currentUser?.id);
      
      if (!currentUser?.id || !selectedProductForNews) {
        setError('User ID or product not found. Please try again.');
        return;
      }

      if (editingNews) {
        // Update existing news
        const newsId = editingNews.id || editingNews._id;
        const updatedNews = await storeOwnerService.updateNews(newsId, form);
        setProductNews(prev => prev.map(n => (n.id || n._id) === newsId ? updatedNews : n));
      } else {
        // Create new news
        const productId = selectedProductForNews.id || selectedProductForNews._id;
        console.log('🔍 DEBUG - About to call createProductNews with:', {
          storeOwnerId: currentUser.id,
          productId: productId,
          newsData: form
        });
        const newNews = await storeOwnerService.createProductNews(currentUser.id, productId, form);
        setProductNews(prev => [newNews, ...prev]);
      }
      
      setShowNewsForm(false);
      setEditingNews(null);
      setError(null);
      if (editingNews) {
        setSuccessMessage('News updated successfully!');
      } else {
        setSuccessMessage('News published successfully! You can add more news for this product.');
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving news:', err);
      setError('Failed to save news: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteNews = async (newsId) => {
    try {
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      await storeOwnerService.deleteNews(newsId);
      setProductNews(prev => prev.filter(n => (n.id || n._id) !== newsId));
      setError(null);
    } catch (err) {
      console.error('Error deleting news:', err);
      setError('Failed to delete news: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateNews = (news) => {
    console.log('🔍 DEBUG - handleUpdateNews called with news:', news);
    setEditingNews(news);
    setShowNewsForm(true);
    setShowNewsModal(false); // Close the modal view when switching to edit form
    console.log('🔍 DEBUG - Set editingNews and showNewsForm to true, showNewsModal to false');
  };

  // Temporary debug function to set user role
  const handleDebugSetRole = () => {
    const debugUser = { ...currentUser, role: 'storeowner', account_type: 'storeowner' };
    console.log('Setting debug user:', debugUser);
    setUser(debugUser);
  };

  const handleRefresh = async () => {
    setRefreshTrigger(prev => prev + 1);
    
    // If we're in the products view, also refresh the selected store's products
    if (showProducts && selectedStore) {
      try {
        if (!currentUser?.id) {
          setError('User ID not found. Please log in again.');
          return;
        }

        const storeId = selectedStore.id || selectedStore._id;
        const products = await storeOwnerService.getStoreProducts(currentUser.id, storeId);
        setSelectedStore(prev => ({ ...prev, products }));
        setError(null);
      } catch (err) {
        console.error('Error refreshing store products:', err);
        setError('Failed to refresh store products: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-700/50 rounded-xl h-24 mb-6"></div>
          <div className="bg-gray-700/50 rounded-xl h-32 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-700/50 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    if (!currentUser?.id) {
      return (
        <div className="p-6 space-y-6">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-300 mb-2">Authentication Error</h2>
            <p className="text-red-200 mb-4">User ID not found. Please log in again.</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <StoreForm
        store={editingStore}
        handleGoBack={handleGoBack}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    );
  }

  if (showProductForm) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {editingProduct ? 'Update Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-300">
                {editingProduct ? 'Update product details' : 'Add a new product to your store'}
              </p>
            </div>
            <button
              onClick={handleCloseProductForm}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </button>
          </div>
        </div>

        <ProductForm
          product={editingProduct}
          handleGoBack={handleCloseProductForm}
          handleSubmit={handleSubmitProduct}
          handleCancel={handleCancelProduct}
        />
      </div>
    );
  }

  if (showNewsForm) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {editingNews ? 'Update News' : 'Publish News'}
              </h1>
              <p className="text-gray-300">
                {editingNews ? 'Update news details' : `Publish news for ${selectedProductForNews?.name}`}
              </p>
            </div>
            <button
              onClick={handleCloseNewsForm}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Products
            </button>
          </div>
        </div>

        <NewsForm
          productId={selectedProductForNews?.id || selectedProductForNews?._id}
          news={editingNews}
          handleGoBack={handleCloseNewsForm}
          handleSubmit={handleSubmitNews}
          handleCancel={handleCloseNewsForm}
        />
      </div>
    );
  }

  if (showNewsModal) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                News for {selectedProductForNews?.name}
              </h1>
              <p className="text-gray-300">View and manage news for this product</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingNews(null);
                  setShowNewsForm(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add News
              </button>
              <button
                onClick={handleCloseNewsModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </button>
            </div>
          </div>
        </div>

        {/* News Content */}
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          {productNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No news found</h3>
              <p className="text-gray-400 mb-4">Get started by publishing your first news for this product.</p>
              <button 
                onClick={() => {
                  setEditingNews(null);
                  setShowNewsForm(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
              >
                Publish Your First News
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">All News ({productNews.length})</h2>
                <button
                  onClick={() => {
                    setEditingNews(null);
                    setShowNewsForm(true);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded text-sm hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add More
                </button>
              </div>
              
              <div className="grid gap-4">
                {productNews.map(news => (
                  <div key={news.id || news._id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{news.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{news.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleUpdateNews(news)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-all duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNews(news.id || news._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Published: {new Date(news.created_at).toLocaleDateString()}
                      </span>
                      {news.updated_at !== news.created_at && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Updated: {new Date(news.updated_at).toLocaleDateString()}
                        </span>
                      )}
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

  if (showProducts && selectedStore) {
    return (
      <div className="p-6 space-y-6 z-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Products for {selectedStore.name}
              </h1>
              <p className="text-gray-300">Manage products and publish news for your store</p>
            </div>
            <button
              onClick={handleCloseProducts}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Stores
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Store Products</h2>
            <div className="flex gap-2">
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button 
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {selectedStore.products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-4">Get started by adding your first product to this store.</p>
              <button 
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedStore.products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDeleteProduct}
                  onUpdate={handleUpdateProduct}
                  onPublishNews={handlePublishNews}
                  onViewAllNews={handleViewAllNews}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Store Management
            </h1>
            <p className="text-gray-300">Create and manage your stores</p>
          </div>
          {/* Debug section - remove in production */}
          <div className="text-xs text-gray-400">
            <div>User ID: {currentUser?.id || 'undefined'}</div>
            <div>User Role: {currentUser?.role || 'undefined'}</div>
            <div>Account Type: {currentUser?.account_type || 'undefined'}</div>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Create Store Button */}
      <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
        <div className="flex justify-end mb-6 gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleCreateStore}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Store
          </button>
        </div>

        {/* Stores List */}
        {stores.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {stores.map(store => (
              <div key={store.id || store._id} className="bg-gray-700/30 rounded-lg border border-gray-600/50 p-4 hover:bg-gray-700/50 transition-all duration-200">
                <StoreCard 
                  store={store} 
                  onUpdate={handleUpdateStore}
                  onDelete={handleDeleteStore}
                  onViewProducts={() => handleViewProducts(store)}
                  onAddProduct={handleAddProductFromStore}
                />
              </div>
            ))}
            </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No stores found</h3>
            <p className="text-gray-400 mb-4">Get started by creating your first store to manage your business.</p>
            <button 
              onClick={handleCreateStore}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg"
            >
              Create Your First Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerRenderStores; 