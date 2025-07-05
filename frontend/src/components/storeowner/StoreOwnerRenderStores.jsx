import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import StoreCard from '../cards/StoreCard.jsx';
import StoreForm from '../forms/StoreForm.jsx';
import ProductCard from '../cards/ProductCard.jsx';
import NewsCardModal from '../modals/NewsCardModal.jsx';
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
        setStores([
          {
            id: 1,
            name: 'Goat Farm',
            description: 'A premium goat farm with organic products.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
            location: '123 Farm Lane, Countryside',
            phone: '+1 555-1234',
            email: 'info@goatfarm.com',
            website: 'https://goatfarm.com',
            facebook: 'https://facebook.com/goatfarm',
            instagram: 'https://instagram.com/goatfarm',
            products: []
          },
          {
            id: 2,
            name: 'Urban Trees',
            description: 'Your local tree nursery and garden center.',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
            location: '456 City Ave, Metropolis',
            phone: '+1 555-5678',
            email: 'contact@urbantrees.com',
            website: 'https://urbantrees.com',
            facebook: 'https://facebook.com/urbantrees',
            instagram: 'https://instagram.com/urbantrees',
            products: []
          },
          {
            id: 3,
            name: 'Fresh Market',
            description: 'Organic produce and local goods.',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
            location: '789 Market St, Downtown',
            phone: '+1 555-9012',
            email: 'hello@freshmarket.com',
            website: 'https://freshmarket.com',
            facebook: 'https://facebook.com/freshmarket',
            instagram: 'https://instagram.com/freshmarket',
            products: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [currentUser?.id]);

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
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      if (editingStore) {
        // Update existing store
        const updatedStore = await storeOwnerService.updateStore(currentUser.id, editingStore.id, form);
        setStores(prev => prev.map(s => s.id === editingStore.id ? updatedStore : s));
      } else {
        // Create new store
        const newStore = await storeOwnerService.createStore(currentUser.id, form);
        setStores(prev => [newStore, ...prev]);
      }
      setShowForm(false);
      setEditingStore(null);
    } catch (err) {
      console.error('Error saving store:', err);
      setError('Failed to save store: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleUpdateStore = (store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleViewProducts = async (store) => {
    try {
      if (!currentUser?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const products = await storeOwnerService.getStoreProducts(currentUser.id, store.id);
      setSelectedStore({ ...store, products });
      setShowProducts(true);
    } catch (err) {
      console.error('Error fetching store products:', err);
      setError('Failed to load store products: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCloseProducts = () => {
    setShowProducts(false);
    setSelectedStore(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await storeOwnerService.deleteProduct(productId);
      if (selectedStore) {
        setStores(prev => prev.map(store => 
          store.id === selectedStore.id 
            ? { ...store, products: store.products.filter(p => p._id !== productId) }
            : store
        ));
        setSelectedStore(prev => ({
          ...prev,
          products: prev.products.filter(p => p._id !== productId)
        }));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleUpdateProduct = (product) => {
    // TODO: Implement product update logic
    console.log('Update product:', product);
  };

  const handlePublishNews = (product) => {
    // TODO: Implement news publishing logic
    console.log('Publish news for product:', product);
  };

  const handleViewAllNews = (product) => {
    // TODO: Implement view all news logic
    console.log('View all news for product:', product);
  };

  // Temporary debug function to set user role
  const handleDebugSetRole = () => {
    const debugUser = { ...currentUser, role: 'storeowner', account_type: 'storeowner' };
    console.log('Setting debug user:', debugUser);
    setUser(debugUser);
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

  if (showProducts && selectedStore) {
    return (
      <div className="p-6 space-y-6">
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

        {/* Products Grid */}
        <div className="bg-gradient-to-br from-slate-800 to-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Store Products</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center gap-2 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
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
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200">
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
        <div className="flex justify-end mb-6">
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
              <div key={store.id} className="bg-gray-700/30 rounded-lg border border-gray-600/50 p-4 hover:bg-gray-700/50 transition-all duration-200">
                <StoreCard 
                  store={store} 
                  onUpdate={handleUpdateStore}
                  onViewProducts={() => handleViewProducts(store)}
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