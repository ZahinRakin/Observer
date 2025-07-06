import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';

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
  onViewAllNews,
  onUnsubscribe,
  onSubscribe,
  isSubscribed = false // New prop to indicate if user is subscribed to this product
}) => {
  const { user } = useUser();
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const isStoreOwner = 
    user?.role === 'storeowner' || 
    user?.account_type === 'storeowner' ||
    user?.role === 'store_owner' ||
    user?.account_type === 'store_owner';

  // Debug: Log user object to see its structure
  console.log('ProductCard - User object:', user);
  console.log('ProductCard - User role:', user?.role);
  console.log('ProductCard - User account_type:', user?.account_type);
  console.log('ProductCard - isStoreOwner:', isStoreOwner);

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(product._id || product.id);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      onUpdate?.(product);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublishNews = async () => {
    setIsPublishing(true);
    try {
      onPublishNews?.(product);
    } catch (error) {
      console.error('Error publishing news:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const buttonConfigs = {
    delete: {
      id: 'product-delete-btn',
      text: isDeleting ? 'Deleting...' : 'Delete',
      color: isDeleting ? 'gray' : 'red',
      onClick: handleDelete,
      visible: isStoreOwner,
      disabled: isDeleting
    },
    update: {
      id: 'product-update-btn',
      text: isUpdating ? 'Updating...' : 'Update',
      color: isUpdating ? 'gray' : 'yellow',
      onClick: handleUpdate,
      visible: isStoreOwner,
      disabled: isUpdating
    },
    publishNews: {
      id: 'product-publish-news-btn',
      text: isPublishing ? 'Publishing...' : 'Publish News',
      color: isPublishing ? 'gray' : 'blue',
      onClick: handlePublishNews,
      visible: isStoreOwner,
      disabled: isPublishing
    },
    viewAllNews: {
      id: 'product-view-news-btn',
      text: 'View All News',
      color: 'purple',
      onClick: () => onViewAllNews?.(product),
      visible: isStoreOwner || (!isStoreOwner && isSubscribed),
      disabled: false
    },
    subscribe: {
      id: 'product-subscribe-btn',
      text: isSubscribing ? 'Subscribing...' : 'Subscribe',
      color: isSubscribing ? 'gray' : 'green',
      onClick: handleSubscribe,
      visible: !isStoreOwner && !isSubscribed,
      disabled: isSubscribing
    },
    unsubscribe: {
      id: 'product-unsubscribe-btn',
      text: isUnsubscribing ? 'Processing...' : 'Unsubscribe',
      color: isUnsubscribing ? 'gray' : 'red',
      onClick: handleUnsubscribe,
      visible: !isStoreOwner && isSubscribed,
      disabled: isUnsubscribing
    }
  };

  return (
    <div className="w-full bg-gray-800/50 rounded-xl shadow-lg p-6 flex flex-col gap-3 mb-4 border border-gray-700/50 backdrop-blur-sm">
      <img
        src={product.image || "/dummy_product.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-2"
      />
      <h3 className="text-lg font-semibold text-gray-200">{product.name}</h3>
      {product.description && <p className="text-gray-400">{product.description}</p>}
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
        {product.category && (
          <span className="bg-gray-700/50 px-3 py-1 rounded-lg border border-gray-600/50 text-gray-300">{product.category}</span>
        )}
        {product.tags?.map((tag, idx) => (
          <span key={idx} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-lg border border-blue-700/50">
            {tag}
          </span>
        ))}
      </div>

      {/* Subscription Status Indicator */}
      {!isStoreOwner && (
        <div className="flex items-center gap-2 text-sm">
          {isSubscribed ? (
            <span className="text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Subscribed
            </span>
          ) : (
            <span className="text-gray-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Not Subscribed
            </span>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-700/50 text-xs text-gray-500 flex justify-between">
        <span>Added: {formatDate(product.created_at)}</span>
        <span>Updated: {formatDate(product.updated_at)}</span>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {Object.entries(buttonConfigs).map(([key, config]) => (
          config.visible && (
            <button
              key={key}
              id={config.id}
              onClick={config.onClick}
              disabled={config.disabled}
              className={`px-4 py-2 bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 text-white rounded-lg hover:from-${config.color}-700 hover:to-${config.color}-800 text-sm font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {config.text}
            </button>
          )
        ))}
      </div>

    </div>
  );
};

export default ProductCard;