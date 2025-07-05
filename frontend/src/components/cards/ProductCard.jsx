import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';
import NewsCardModal from '../modals/NewsCardModal.jsx';

const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

const ProductCard = ({ 
  product, 
  onDelete, 
  onUpdate, 
  onPublishNews,
  onUnsubscribe,
  onSubscribe,
  isSubscribed = false // New prop to indicate if user is subscribed to this product
}) => {
  const { user } = useUser();
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const isStoreOwner = user?.role === 'store_owner';

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onUnsubscribe?.(product._id);
    } catch (error) {
      console.error('Error unsubscribing:', error);
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubscribe?.(product._id);
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const buttonConfigs = {
    delete: {
      id: 'product-delete-btn',
      text: 'Delete',
      color: 'red',
      onClick: () => onDelete?.(product),
      visible: isStoreOwner
    },
    update: {
      id: 'product-update-btn',
      text: 'Update',
      color: 'yellow',
      onClick: () => onUpdate?.(product),
      visible: isStoreOwner
    },
    publishNews: {
      id: 'product-publish-news-btn',
      text: 'Publish News',
      color: 'blue',
      onClick: () => onPublishNews?.(product),
      visible: isStoreOwner
    },
    viewAllNews: {
      id: 'product-view-news-btn',
      text: 'View All News',
      color: 'purple',
      onClick: () => setShowNewsModal(true),
      visible: !isStoreOwner && isSubscribed // Only show to customers who are subscribed
    },
    subscribe: {
      id: 'product-subscribe-btn',
      text: isSubscribing ? 'Subscribing...' : 'Subscribe',
      color: isSubscribing ? 'gray' : 'green',
      onClick: handleSubscribe,
      visible: !isStoreOwner && !isSubscribed // Only show to customers who are not subscribed
    },
    unsubscribe: {
      id: 'product-unsubscribe-btn',
      text: isUnsubscribing ? 'Processing...' : 'Unsubscribe',
      color: isUnsubscribing ? 'gray' : 'red',
      onClick: handleUnsubscribe,
      visible: !isStoreOwner && isSubscribed // Only show to customers who are subscribed
    }
  };

  return (
    <div className="w-full bg-white rounded shadow p-4 flex flex-col gap-2 mb-4">
      <img
        src={product.image || "/dummy_product.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      {product.description && <p className="text-gray-600">{product.description}</p>}
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
        {product.category && (
          <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
        )}
        {product.tags?.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Subscription Status Indicator */}
      {!isStoreOwner && (
        <div className="flex items-center gap-2 text-sm">
          {isSubscribed ? (
            <span className="text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Subscribed
            </span>
          ) : (
            <span className="text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Not Subscribed
            </span>
          )}
        </div>
      )}

      <div className="mt-4 pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
        <span>Added: {formatDate(product.created_at)}</span>
        <span>Updated: {formatDate(product.updated_at)}</span>
      </div>

      <div className="flex gap-2 mt-2 flex-wrap">
        {Object.entries(buttonConfigs).map(([key, config]) => (
          config.visible && (
            <button
              key={key}
              id={config.id}
              onClick={config.onClick}
              disabled={(isUnsubscribing && key === 'unsubscribe') || (isSubscribing && key === 'subscribe')}
              className={`px-3 py-1 bg-${config.color}-500 text-white rounded hover:bg-${config.color}-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {config.text}
            </button>
          )
        ))}
      </div>

      {/* News Modal - Only show if subscribed */}
      {showNewsModal && isSubscribed && (
        <NewsCardModal 
          open={showNewsModal}
          onClose={() => setShowNewsModal(false)}
          productId={product._id}
          isStoreOwner={isStoreOwner}
        />
      )}
    </div>
  );
};

export default ProductCard;