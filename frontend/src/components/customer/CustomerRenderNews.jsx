import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import NewsCard from '../cards/NewsCard.jsx';
import ProductCard from '../cards/ProductCard.jsx';
import LoadingAnimation from '../Loading.jsx';

const RenderNews = ({ customerId }) => {
    const { user } = useContext(UserContext);
    const [news, setNews] = useState([]);
    const [subscribedProducts, setSubscribedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Sample data structure that matches what your API would return
    const dummyNews = [
      {
        _id: '1',
        title: 'New Product Launch',
        description: 'We are excited to announce our newest product line launching next week!',
        created_at: new Date('2023-05-15T10:00:00Z'),
        updated_at: new Date('2023-05-15T10:00:00Z'),
        product: {
          _id: 'prod1',
          name: 'Premium Smartwatch',
          description: 'The latest in wearable technology',
          category: 'Electronics',
          tags: ['wearable', 'smart', 'fitness'],
          created_at: new Date('2023-05-10T08:00:00Z'),
          updated_at: new Date('2023-05-10T08:00:00Z')
        }
      },
      {
        _id: '2',
        title: 'Summer Sale Announcement',
        description: 'Get 20% off on all products during our annual summer sale!',
        created_at: new Date('2023-06-01T09:30:00Z'),
        updated_at: new Date('2023-06-01T09:30:00Z'),
        product: {
          _id: 'prod2',
          name: 'Wireless Earbuds',
          description: 'Crystal clear sound with noise cancellation',
          category: 'Audio',
          tags: ['wireless', 'audio', 'bluetooth'],
          created_at: new Date('2023-04-15T08:00:00Z'),
          updated_at: new Date('2023-04-15T08:00:00Z')
        }
      },
      {
        _id: '3',
        title: 'Product Update Available',
        description: 'New firmware update available for your devices with improved features',
        created_at: new Date('2023-06-10T14:15:00Z'),
        updated_at: new Date('2023-06-10T14:15:00Z'),
        product: {
          _id: 'prod3',
          name: 'Smart Home Hub',
          description: 'Control all your smart devices from one place',
          category: 'Home Automation',
          tags: ['smart home', 'iot', 'controller'],
          created_at: new Date('2023-03-20T08:00:00Z'),
          updated_at: new Date('2023-03-20T08:00:00Z')
        }
      }
    ];

    // Mock subscribed products - in real app, this would come from API
    const mockSubscribedProducts = ['prod1', 'prod2']; // User is subscribed to prod1 and prod2
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, use the dummy data
          // In production, you would use the real API call:
          // const response = await fetch(`/api/customer-news/${customerId}`);
          // if (!response.ok) throw new Error('Failed to fetch news');
          // const data = await response.json();
          
          setNews(dummyNews);
          setSubscribedProducts(mockSubscribedProducts);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNews();
    }, [customerId]);
  
    const handleDelete = async (newsItem) => {
      try {
        // Call your API to delete the news item
        const response = await fetch(`/api/news/${newsItem._id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove the deleted news from state
          setNews(news.filter(item => item._id !== newsItem._id));
        }
      } catch (err) {
        console.error('Error deleting news:', err);
      }
    };
  
    const handleUpdate = (newsItem) => {
      // Implement your update logic or navigation to update page
      console.log('Update news:', newsItem);
    };

    const handleSubscribe = (productId) => {
      // Add product to subscribed list
      setSubscribedProducts(prev => [...prev, productId]);
    };

    const handleUnsubscribe = (productId) => {
      // Remove product from subscribed list
      setSubscribedProducts(prev => prev.filter(id => id !== productId));
    };

    const handleViewAllNews = (product) => {
      // Implement navigation to news view for this product
      console.log('View all news for:', product.name);
    };
  
    if (loading) return <LoadingAnimation />;
    if (error) return <div>Error: {error}</div>;
    if (news.length === 0) return <div>No news available.</div>;
  
    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Latest News</h1>
          <p className="text-gray-600">Stay updated with news from your subscribed products</p>
        </div>
        
        <div className="grid gap-6">
          {news.map((item) => (
            <div key={item._id} className="space-y-4">
              <NewsCard 
                news={item} 
                onDelete={handleDelete} 
                onUpdate={handleUpdate} 
              />
              
              {/* Display related product using ProductCard */}
              {item.product && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Related Product</h4>
                  <ProductCard
                    product={item.product}
                    onSubscribe={handleSubscribe}
                    onUnsubscribe={handleUnsubscribe}
                    onViewAllNews={handleViewAllNews}
                    isSubscribed={subscribedProducts.includes(item.product._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default RenderNews;