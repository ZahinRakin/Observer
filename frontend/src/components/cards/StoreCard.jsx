import React, { useState } from 'react';
import ProductModal from '../modals/ProductModal';
import ProductFormModal from '../modals/ProductFormModal';
import NewsFormModal from '../modals/NewsFormModal';

/**
 * StoreCard - Card component to display a single store
 * Props: store (object with fields: name, description, image, location, phone, email, website, facebook, instagram)
 */
const StoreCard = ({ store, onDelete, onUpdate, onViewProducts }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState(store.products || []);
  const [deleted, setDeleted] = useState(false);
  const [storeState, setStoreState] = useState(store);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsProduct, setNewsProduct] = useState(null);

  const handleDelete = async (e) => {
    e.stopPropagation();
    // TODO: Communicate with backend to delete the store
    // Example: await axios.delete(`/api/v1/stores/${storeState.id}`);
    setDeleted(true); // Remove from UI after successful delete
    if (onDelete) onDelete(storeState);
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();
    // TODO: Communicate with backend to update the store
    // Example: const updated = await axios.put(`/api/v1/stores/${storeState.id}`, { ...storeState, name: storeState.name + ' (Updated)' });
    const updated = { ...storeState, name: storeState.name + ' (Updated)' };
    setStoreState(updated); // Update local state for UI
    if (onUpdate) onUpdate(updated);
  };

  const handleAddProduct = () => {
    setModalOpen(false); // Close ProductModal before opening form
    setEditingProduct(null);
    setShowProductForm(true);
  };

  // Handler for updating a product from ProductCard
  const handleUpdateProduct = (product) => {
    setModalOpen(false); // Close ProductModal before opening form
    setEditingProduct(product);
    setShowProductForm(true);
  };

  // Handler for publishing news from ProductCard/ProductModal
  const handlePublishNews = (product) => {
    setModalOpen(false); // Hide ProductModal
    setShowProductForm(false);
    setEditingProduct(null);
    setNewsProduct(product);
    setShowNewsModal(true);
  };

  const handleProductGoBack = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setModalOpen(true); // Reopen ProductModal if needed
  };

  const handleProductCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setModalOpen(true); // Reopen ProductModal if needed
  };

  const handleProductSubmit = (form) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...form } : p));
    } else {
      setProducts(prev => [{ ...form, id: Date.now() }, ...prev]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
    setModalOpen(true); // Reopen ProductModal if needed
  };

  const handleNewsGoBack = () => {
    setShowNewsModal(false);
    setNewsProduct(null);
    setModalOpen(true); // Reopen ProductModal
  };

  const handleNewsCancel = () => {
    setShowNewsModal(false);
    setNewsProduct(null);
    setModalOpen(true); // Reopen ProductModal
  };

  const handleNewsSubmit = (newsData) => {
    // TODO: Integrate with backend or update state as needed
    setShowNewsModal(false);
    setNewsProduct(null);
    setModalOpen(true); // Reopen ProductModal
  };

  if (deleted) return null;

  return (
    <>
      <ProductFormModal
        open={showProductForm}
        onClose={handleProductCancel}
        product={editingProduct}
        onSubmit={handleProductSubmit}
        onGoBack={handleProductGoBack}
        onCancel={handleProductCancel}
      />
      <NewsFormModal
        open={showNewsModal}
        onClose={handleNewsCancel}
        productId={newsProduct?.id}
        news={null}
        onSubmit={handleNewsSubmit}
        onGoBack={handleNewsGoBack}
        onCancel={handleNewsCancel}
      />
      <div
        className="w-full bg-gray-800/50 rounded-xl shadow-lg p-6 flex flex-col gap-3 mb-4 cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm"
        onClick={() => setModalOpen(true)}
      >
        {storeState.image && (
          <img
            src={storeState.image}
            alt={storeState.name}
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        )}
        <h2 className="text-xl font-semibold text-gray-200">{storeState.name}</h2>
        <p className="text-gray-400">{storeState.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
          <span>📍 {storeState.location}</span>
          <span>📞 {storeState.phone}</span>
          <span>✉️ {storeState.email}</span>
        </div>
        <div className="flex gap-3 mt-2">
          {storeState.website && (
            <a
              href={storeState.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Website
            </a>
          )}
          {storeState.facebook && (
            <a
              href={storeState.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Facebook
            </a>
          )}
          {storeState.instagram && (
            <a
              href={storeState.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors duration-200"
            >
              Instagram
            </a>
          )}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {onViewProducts && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onViewProducts(storeState); }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all duration-200 shadow-lg"
            >
              View Products
            </button>
          )}
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 text-sm font-medium transition-all duration-200 shadow-lg"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 text-sm font-medium transition-all duration-200 shadow-lg"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); handleAddProduct(); }}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium transition-all duration-200 shadow-lg"
          >
            Add Product
          </button>
        </div>
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        store={{ ...storeState, products }}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onPublishNews={handlePublishNews}
      />
    </>
  );
};

export default StoreCard;
