import React, { useState } from 'react';

/**
 * StoreCard - Card component to display a single store
 * Props: store (object with fields: name, description, image, location, phone, email, website, facebook, instagram)
 */
const StoreCard = ({ store, onDelete, onUpdate, onViewProducts, onAddProduct }) => {
  const [deleted, setDeleted] = useState(false);
  const [storeState, setStoreState] = useState(store);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete(storeState);
      setDeleted(true); // Remove from UI after successful delete
    }
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate(storeState);
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct(storeState);
    }
  };

  if (deleted) return null;

  return (
    <div
      className="w-full bg-gray-800/50 rounded-xl shadow-lg p-6 flex flex-col gap-3 mb-4 hover:shadow-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm"
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
  );
};

export default StoreCard;
