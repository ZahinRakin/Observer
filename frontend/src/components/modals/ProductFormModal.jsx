import React from 'react';
import ProductForm from '../forms/ProductForm';

const ProductFormModal = ({ open, onClose, product, onSubmit, onGoBack, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-700/50">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold transition-colors duration-200"
          onClick={onClose}
        >
          &times;
        </button>
        <ProductForm
          product={product}
          handleGoBack={onGoBack}
          handleSubmit={onSubmit}
          handleCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default ProductFormModal;
