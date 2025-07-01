import React, { useState } from 'react';
import ProductModal from '../modals/ProductModal';

/**
 * StoreCard - Card component to display a single store
 * Props: store (object with fields: name, description, image, location, phone, email, website, facebook, instagram)
 */
const StoreCard = ({ store, onDelete, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState(store.products || []);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(store, () => setProducts([])); // Optionally clear products after delete
    } else {
      alert(`Delete store: ${store.name}`);
      setProducts([]); // Remove all products from UI after delete
    }
  };
  const handleUpdate = (e) => {
    e.stopPropagation();
    if (onUpdate) {
      // Simulate update: fetch or set new products
      onUpdate(store, (newProducts) => setProducts(newProducts));
    } else {
      alert(`Update store: ${store.name}`);
      // Simulate update: add a dummy product
      setProducts([{ name: 'Updated Product', description: 'This is a new product after update.' }]);
    }
  };

  return (
    <>
      <div
        className="w-full bg-white rounded shadow p-4 flex flex-col gap-2 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setModalOpen(true)}
      >
        {store.image && (
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-40 object-cover rounded mb-2"
          />
        )}
        <h2 className="text-xl font-semibold text-gray-800">{store.name}</h2>
        <p className="text-gray-600">{store.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
          <span>📍 {store.location}</span>
          <span>📞 {store.phone}</span>
          <span>✉️ {store.email}</span>
        </div>
        <div className="flex gap-3 mt-2">
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Website
            </a>
          )}
          {store.facebook && (
            <a
              href={store.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
          )}
          {store.instagram && (
            <a
              href={store.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
        <div className="flex gap-2 mt-4">
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
        </div>
      </div>
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        store={{ ...store, products }}
        products={products}
      />
    </>
  );
};

export default StoreCard;
