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
        className="w-full bg-white rounded shadow p-4 flex flex-col gap-2 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setModalOpen(true)}
      >
        {storeState.image && (
          <img
            src={storeState.image}
            alt={storeState.name}
            className="w-full h-40 object-cover rounded mb-2"
          />
        )}
        <h2 className="text-xl font-semibold text-gray-800">{storeState.name}</h2>
        <p className="text-gray-600">{storeState.description}</p>
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
              className="text-blue-600 hover:underline"
            >
              Website
            </a>
          )}
          {storeState.facebook && (
            <a
              href={storeState.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
          )}
          {storeState.instagram && (
            <a
              href={storeState.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
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
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              View Products
            </button>
          )}
          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); handleAddProduct(); }}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
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
