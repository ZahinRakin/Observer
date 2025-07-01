import React from 'react';

const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

const NewsCard = ({ news, onDelete, onUpdate }) => {
  const handleDelete = () => {
    if (onDelete) onDelete(news);
  };
  const handleUpdate = () => {
    if (onUpdate) onUpdate(news);
  };
  return (
    <div className="bg-gray-50 rounded shadow p-4 flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-800">{news.title}</h3>
      <p className="text-gray-600 mb-2">{news.description}</p>
      <div className="text-xs text-gray-500 flex gap-4">
        <span>Created: {formatDate(news.created_at)}</span>
        <span>Updated: {formatDate(news.updated_at)}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Delete</button>
        <button onClick={handleUpdate} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Update</button>
      </div>
    </div>
  );
};

export default NewsCard;
