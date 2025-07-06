import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import NewsCard from '../cards/NewsCard.jsx';
import LoadingAnimation from '../Loading.jsx';
import axios from 'axios';

const RenderNews = () => {
    const { user } = useContext(UserContext);
    const [news, setNews] = useState([]);
    const [subscribedProducts, setSubscribedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await axios.get(`/api/v1/news/${user.id}`);
          const data = response.data;
          console.log("inside of RenderNews for customer: ", data); //debugging log
          setNews(data.news);
          setSubscribedProducts(data.subscribed_products);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNews();
    }, [user.id]);
  
    // const handleDelete = async (newsItem) => {
    //   try {
    //     // Call your API to delete the news item
    //     const response = await axios.delete(`/api/news/${newsItem._id}`);
        
    //     if (response.ok) {
    //       // Remove the deleted news from state
    //       setNews(news.filter(item => item._id !== newsItem._id));
    //     }
    //   } catch (err) {
    //     console.error('Error deleting news:', err);
    //   }
    // };
  
    // const handleUpdate = async (newsItem) => {
    //   // Implement your update logic or navigation to update page
    //   //complete this method
    //   console.log('Update news:', newsItem);
    // };

    const handleViewProduct = async (newsItem) => {
      try {
        setProductLoading(true);
        const response = await axios.get(`/api/v1/product/${newsItem.product}`);
        const product = response.data;
        setSelectedProduct(product);
        setShowProductModal(true);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setProductLoading(false);
      }
    };

    const closeProductModal = () => {
      setShowProductModal(false);
      setSelectedProduct(null);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    if (loading) return <LoadingAnimation />;
    if (error) return <div className="text-red-400">Error: {error}</div>;
    if (news.length === 0) return <div className="text-gray-300">No news available.</div>;
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Professional Header Section */}
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
            
            {/* Content */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                      Latest News
                    </h1>
                    <p className="text-gray-300 mt-1">Stay informed with real-time updates from your subscribed products</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Last updated</div>
                    <div className="text-white font-medium">{new Date().toLocaleDateString()}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                </div>
              </div>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white">{news.length}</div>
                  <div className="text-sm text-gray-400">Total Articles</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-green-400">{news.filter(n => n.product).length}</div>
                  <div className="text-sm text-gray-400">With Products</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">Live</div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* News Content */}
          <div className="grid gap-6">
            {news.map((item, index) => (
              <div key={item._id} className="space-y-4">
                <NewsCard 
                  news={item} 
                  // onDelete={handleDelete} 
                  // onUpdate={handleUpdate} 
                  // onMarkAsSeen={handleMarkAsSeen}
                />
                
                {/* Enhanced Related Product Display */}
                {item.product && (
                  <button
                    onClick={() => handleViewProduct(item)}
                    disabled={productLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {productLoading ? 'Loading...' : 'View Product'}
                  </button>
                )}
                
                {/* Divider - only show if not the last item */}
                {index < news.length - 1 && (
                  <div className="relative flex items-center justify-center py-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600/40 to-transparent"></div>
                    </div>
                    <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-6 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-500/60 rounded-full"></div>
                        <div className="w-2 h-2 bg-indigo-500/60 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {news.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No news available</h3>
              <p className="text-gray-500">Check back later for the latest updates</p>
            </div>
          )}
        </div>

        {/* Product Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Product Details
                </h2>
                <button
                  onClick={closeProductModal}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Product Image */}
                {selectedProduct.image && (
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                    {selectedProduct.description && (
                      <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                    )}
                  </div>

                  {/* Category */}
                  {selectedProduct.category && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Category:</span>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
                        {selectedProduct.category}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-400">Created</span>
                      <p className="text-white font-medium">{formatDate(selectedProduct.created_at)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-400">Updated</span>
                      <p className="text-white font-medium">{formatDate(selectedProduct.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-white/10">
                <button
                  onClick={closeProductModal}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default RenderNews;