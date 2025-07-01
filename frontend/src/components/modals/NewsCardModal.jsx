import React, { useState } from 'react';
import NewsCard from '../cards/NewsCard';
import NewsFormModal from './NewsFormModal';

// Dummy news data for demo
const dummyNews = [
  {
    id: 1,
    title: 'Grand Opening!',
    description: 'We are excited to announce the grand opening of our new store!',
    created_at: new Date('2025-06-01T10:00:00Z'),
    updated_at: new Date('2025-06-01T10:00:00Z'),
  },
  {
    id: 2,
    title: 'Fresh Products Arrived',
    description: 'Check out our latest batch of organic honey and goat milk.',
    created_at: new Date('2025-06-15T12:30:00Z'),
    updated_at: new Date('2025-06-15T12:30:00Z'),
  },
];

const NewsCardModal = ({ open, onClose, newsList = dummyNews }) => {
  const [news, setNews] = useState(newsList);
  const [editingNews, setEditingNews] = useState(null);
  const [showNewsForm, setShowNewsForm] = useState(false);

  const handleDelete = (newsItem) => {
    // TODO: Communicate with backend to delete news
    setNews(prev => prev.filter(n => n.id !== newsItem.id));
  };

  const handleUpdate = (newsItem) => {
    setEditingNews(newsItem);
    setShowNewsForm(true);
  };

  const handleNewsFormSubmit = (form) => {
    // TODO: Communicate with backend to update news
    setNews(prev => prev.map(n => n.id === editingNews.id ? { ...n, ...form, updated_at: new Date() } : n));
    setShowNewsForm(false);
    setEditingNews(null);
  };

  const handleNewsFormCancel = () => {
    setShowNewsForm(false);
    setEditingNews(null);
  };

  if (!open) return null;

  return (
    <>
      <NewsFormModal
        open={showNewsForm}
        onClose={handleNewsFormCancel}
        news={editingNews}
        productId={editingNews?.product}
        onSubmit={handleNewsFormSubmit}
        onGoBack={handleNewsFormCancel}
        onCancel={handleNewsFormCancel}
      />
      {/* Only render NewsCardModal content if NewsFormModal is not open */}
      {!showNewsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={onClose}
            >
              &#8592; Back
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">All News</h2>
            <div className="flex flex-col gap-4">
              {news.length > 0 ? (
                news.map((item) => (
                  <NewsCard
                    key={item.id}
                    news={item}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))
              ) : (
                <div className="text-gray-400 text-center">No news found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCardModal;
