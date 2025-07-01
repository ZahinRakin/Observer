import React from 'react';
import NewsForm from '../forms/NewsForm';

const NewsFormModal = ({ open, onClose, productId, news, onSubmit, onGoBack, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <NewsForm
          productId={productId}
          news={news}
          handleGoBack={onGoBack}
          handleSubmit={onSubmit}
          handleCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default NewsFormModal;
