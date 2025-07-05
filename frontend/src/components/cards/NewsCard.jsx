import React from 'react';
import { useUser } from '../../contexts/UserContext.jsx';

const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

const NewsCard = ({ news, onDelete, onUpdate, onMarkAsSeen }) => {
  const { user } = useUser();
  const isStoreOwner = 
    user?.role === 'storeowner' || 
    user?.account_type === 'storeowner' ||
    user?.role === 'store_owner' ||
    user?.account_type === 'store_owner';

  const buttonConfigs = {
    delete: {
      id: 'news-delete-btn',
      text: 'Delete',
      color: 'red',
      onClick: () => onDelete?.(news),
      visible: isStoreOwner
    },
    update: {
      id: 'news-update-btn',
      text: 'Update',
      color: 'yellow',
      onClick: () => onUpdate?.(news),
      visible: isStoreOwner
    },
    markAsSeen: {
      id: 'news-seen-btn',
      text: 'Mark as Seen',
      color: 'blue',
      onClick: () => onMarkAsSeen?.(news),
      visible: !isStoreOwner
    }
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
        {Object.entries(buttonConfigs).map(([key, config]) => (
          config.visible && (
            <button
              key={key}
              id={config.id}
              onClick={config.onClick}
              className={`px-3 py-1 bg-${config.color}-500 text-white rounded hover:bg-${config.color}-600 text-sm`}
            >
              {config.text}
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default NewsCard;


{// For Store Owner
/* <NewsCard 
  news={newsItem}
  onDelete={handleDeleteNews}
  onUpdate={handleUpdateNews}
/>

// For Customer
<NewsCard 
  news={newsItem}
  onMarkAsSeen={handleMarkAsSeen}
/> */}