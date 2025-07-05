import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import StoreCard from '../cards/StoreCard.jsx';
import StoreForm from '../forms/StoreForm.jsx';
import ProductCard from '../cards/ProductCard.jsx';
import NewsCardModal from '../modals/NewsCardModal.jsx';

const dummyStores = [
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
    products: [
      {
        _id: 'prod1',
        name: 'Organic Goat Milk',
        description: 'Fresh and healthy goat milk from our farm.',
        image: '/dummy_product.jpg',
        category: 'Dairy',
        tags: ['organic', 'milk', 'goat'],
        created_at: new Date('2023-05-10'),
        updated_at: new Date('2023-06-15')
      },
      {
        _id: 'prod2',
        name: 'Fresh Honey',
        description: 'Pure honey harvested from local bees.',
        image: '/dummy_product.jpg',
        category: 'Food',
        tags: ['honey', 'organic', 'sweet'],
        created_at: new Date('2023-04-20'),
        updated_at: new Date('2023-05-30')
      }
    ]
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
    products: [
      {
        _id: 'prod3',
        name: 'Apple Tree',
        description: 'A young apple tree ready for your garden.',
        image: '/dummy_product.jpg',
        category: 'Plants',
        tags: ['tree', 'fruit', 'apple'],
        created_at: new Date('2023-03-15'),
        updated_at: new Date('2023-04-25')
      }
    ]
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
  },
];

const StoreOwnerRenderStores = ({ user }) => {
  const { user: contextUser, setUser } = useContext(UserContext);
  // Use contextUser if user prop is not provided
  const currentUser = user || contextUser;
  const [stores, setStores] = useState(dummyStores);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  // Debug: Log user objects to see what's being passed
  console.log('StoreOwnerRenderStores - user prop:', user);
  console.log('StoreOwnerRenderStores - contextUser:', contextUser);
  console.log('StoreOwnerRenderStores - currentUser:', currentUser);

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

  const handleSubmit = (form) => {
    if (editingStore) {
      // Update existing store
      setStores(prev => prev.map(s => s.id === editingStore.id ? { ...s, ...form } : s));
    } else {
      // Create new store
      setStores(prev => [{ ...form, id: Date.now(), products: [] }, ...prev]);
    }
    setShowForm(false);
    setEditingStore(null);
  };

  const handleUpdateStore = (store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleViewProducts = (store) => {
    setSelectedStore(store);
    setShowProducts(true);
  };

  const handleCloseProducts = () => {
    setShowProducts(false);
    setSelectedStore(null);
  };

  const handleDeleteProduct = (productId) => {
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

  if (showForm) {
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
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Products for {selectedStore.name}</h1>
              <p className="text-gray-600">Manage products and publish news</p>
            </div>
            <button
              onClick={handleCloseProducts}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ← Back to Stores
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Store Products</h2>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              + Add Product
            </button>
          </div>

          {selectedStore.products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Management</h1>
              <p className="text-gray-600">Create and manage your stores</p>
            </div>
            <button
              onClick={handleDebugSetRole}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Debug: Set Store Owner Role
            </button>
          </div>
        </div>

      {/* Create Store Button */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleCreateStore}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow"
          >
            + Create New Store
          </button>
        </div>

        {/* Stores List */}
        {stores.length > 0 ? (
          <div className="space-y-4">
            {stores.map(store => (
              <div key={store.id} className="border border-gray-200 rounded-lg p-4">
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
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first store.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerRenderStores; 