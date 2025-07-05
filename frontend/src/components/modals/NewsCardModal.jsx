import React, { useState } from 'react';
import NewsCard from '../cards/NewsCard.jsx';
import NewsFormModal from './NewsFormModal.jsx';

const NewsCardModal = ({ 
  open, 
  onClose, 
  productId,
  isStoreOwner = false,
  initialNews = []
}) => {
  const [news, setNews] = useState(initialNews);
  const [editingNews, setEditingNews] = useState(null);
  const [showNewsForm, setShowNewsForm] = useState(false);

  // For demo purposes - in real app you would fetch news for the productId
  const demoNews = [
    {
      id: 1,
      title: 'Product Update',
      description: `New features added to product ${productId}`,
      created_at: new Date('2025-06-01T10:00:00Z'),
      updated_at: new Date('2025-06-01T10:00:00Z'),
    },
    {
      id: 2,
      title: 'Special Offer',
      description: `Limited time discount for product ${productId}`,
      created_at: new Date('2025-06-15T12:30:00Z'),
      updated_at: new Date('2025-06-15T12:30:00Z'),
    },
  ];

  // Initialize with demo news if no initialNews provided
  if (news.length === 0 && initialNews.length === 0) {
    setNews(demoNews);
  }

  const handleDelete = (newsItem) => {
    setNews(prev => prev.filter(n => n.id !== newsItem.id));
  };

  const handleUpdate = (newsItem) => {
    setEditingNews(newsItem);
    setShowNewsForm(true);
  };

  const handleNewsSubmit = (formData) => {
    if (editingNews) {
      // Update existing news
      setNews(prev => 
        prev.map(n => n.id === editingNews.id ? 
          { ...n, ...formData, updated_at: new Date() } : n
        )
      );
    } else {
      // Add new news
      const newNews = {
        ...formData,
        id: Math.max(...news.map(n => n.id), 0) + 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      setNews(prev => [...prev, newNews]);
    }
    setShowNewsForm(false);
    setEditingNews(null);
  };

  if (!open) return null;

  return (
    <>
      <NewsFormModal
        open={showNewsForm}
        onClose={() => setShowNewsForm(false)}
        news={editingNews}
        onSubmit={handleNewsSubmit}
        productId={productId}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
        <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto border border-gray-700/50">
          <button
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-200 text-xl font-bold transition-colors duration-200"
            onClick={onClose}
          >
            &#8592; Back
          </button>
          
          <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Product News</h2>
          
          {isStoreOwner && (
            <button
              onClick={() => {
                setEditingNews(null);
                setShowNewsForm(true);
              }}
              className="mb-4 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg font-medium"
            >
              Create New News
            </button>
          )}

          <div className="flex flex-col gap-4">
            {news.length > 0 ? (
              news.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  onDelete={isStoreOwner ? handleDelete : undefined}
                  onUpdate={isStoreOwner ? handleUpdate : undefined}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-8">No news found for this product.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsCardModal;

