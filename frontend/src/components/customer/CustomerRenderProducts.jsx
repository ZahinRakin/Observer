import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import LoadingAnimation from '../Loading.jsx';
import ProductCard from '../cards/ProductCard.jsx';

const RenderProducts = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('subscribed'); // 'subscribed' or 'recommended'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/customers/${user._id}/products`);
        // const data = await response.json();
        
        // Mock data with additional fields
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockProducts = [
          {
            _id: 'prod1',
            name: 'Premium Smartwatch',
            description: 'Health monitoring wearable with advanced fitness tracking',
            image: '/smartwatch.jpg',
            category: 'Electronics',
            tags: ['wearable', 'fitness', 'health'],
            created_at: new Date('2023-05-10'),
            updated_at: new Date('2023-06-15')
          },
          {
            _id: 'prod2',
            name: 'Wireless Earbuds',
            description: 'Noise-cancelling audio with premium sound quality',
            image: '/earbuds.jpg',
            category: 'Audio',
            tags: ['bluetooth', 'music', 'wireless'],
            created_at: new Date('2023-04-20'),
            updated_at: new Date('2023-05-30')
          },
          {
            _id: 'prod3',
            name: 'Smart Home Hub',
            description: 'Control all your smart devices from one central hub',
            image: '/hub.jpg',
            category: 'Home Automation',
            tags: ['smart home', 'iot', 'controller'],
            created_at: new Date('2023-03-15'),
            updated_at: new Date('2023-04-25')
          }
        ];

        const mockRecommendedProducts = [
          {
            _id: 'rec1',
            name: 'Gaming Laptop',
            description: 'High-performance gaming laptop with RTX graphics',
            image: '/laptop.jpg',
            category: 'Computers',
            tags: ['gaming', 'laptop', 'performance'],
            created_at: new Date('2023-06-01'),
            updated_at: new Date('2023-06-10'),
            store: 'TechStore Pro'
          },
          {
            _id: 'rec2',
            name: 'Smart Coffee Maker',
            description: 'WiFi-enabled coffee maker with app control',
            image: '/coffee.jpg',
            category: 'Kitchen',
            tags: ['smart', 'coffee', 'app-controlled'],
            created_at: new Date('2023-05-20'),
            updated_at: new Date('2023-06-05'),
            store: 'Home Essentials'
          },
          {
            _id: 'rec3',
            name: 'Fitness Tracker',
            description: 'Advanced fitness tracking with heart rate monitoring',
            image: '/tracker.jpg',
            category: 'Fitness',
            tags: ['fitness', 'tracking', 'health'],
            created_at: new Date('2023-06-08'),
            updated_at: new Date('2023-06-12'),
            store: 'HealthTech Solutions'
          },
          {
            _id: 'rec4',
            name: 'Portable Speaker',
            description: 'Waterproof portable speaker with 360° sound',
            image: '/speaker.jpg',
            category: 'Audio',
            tags: ['portable', 'waterproof', 'bluetooth'],
            created_at: new Date('2023-05-25'),
            updated_at: new Date('2023-06-08'),
            store: 'AudioMax'
          }
        ];

        setProducts(mockProducts);
        setRecommendedProducts(mockRecommendedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?._id]);

  const handleUnsubscribe = (productId) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const handleSubscribe = (productId) => {
    // Add to subscribed products and remove from recommended
    const productToSubscribe = recommendedProducts.find(p => p._id === productId);
    if (productToSubscribe) {
      setProducts(prev => [...prev, productToSubscribe]);
      setRecommendedProducts(prev => prev.filter(p => p._id !== productId));
    }
  };

  const handleViewAllNews = (product) => {
    // Implement navigation to news view for this product
    console.log('View all news for:', product.name);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRecommendedProducts = recommendedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Management</h1>
        <p className="text-gray-600">Discover and manage your product subscriptions</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products by name, description, category, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('subscribed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscribed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Subscriptions ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recommended'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Recommended ({recommendedProducts.length})
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'subscribed' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Subscribed Products</h2>
                <p className="text-gray-600">Manage your product subscriptions and stay updated</p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} of {products.length} products
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by subscribing to some products.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product._id}
                    product={product}
                    onUnsubscribe={handleUnsubscribe}
                    onViewAllNews={handleViewAllNews}
                    onSubscribe={handleSubscribe}
                    isSubscribed={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recommended Products</h2>
                <p className="text-gray-600">Discover products you might be interested in</p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredRecommendedProducts.length} of {recommendedProducts.length} products
              </div>
            </div>
            
            {filteredRecommendedProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new recommendations.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecommendedProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <img
                      src={product.image || "/dummy_product.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                          {product.category}
                        </span>
                        {product.tags?.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        <span>Store: {product.store}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubscribe(product._id)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Subscribe
                        </button>
                        <button
                          onClick={() => handleViewAllNews(product)}
                          className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          View News
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderProducts;