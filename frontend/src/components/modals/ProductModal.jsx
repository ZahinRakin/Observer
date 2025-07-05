import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import ProductCard from '../cards/ProductCard';
import ProductFormModal from '../modals/ProductFormModal';
import NewsFormModal from '../modals/NewsFormModal';
import NewsCardModal from '../modals/NewsCardModal';

const dummyProducts = [
  {
    name: 'Organic Goat Milk',
    description: 'Fresh and healthy goat milk from our farm.',
    image: '/dummy_product.jpg',
    category: 'Dairy',
    tags: ['organic', 'milk', 'goat'],
  },
  {
    name: 'Apple Tree',
    description: 'A young apple tree ready for your garden.',
    image: '/dummy_product.jpg',
    category: 'Plants',
    tags: ['tree', 'fruit', 'apple'],
  },
  {
    name: 'Fresh Honey',
    description: 'Pure honey harvested from local bees.',
    image: '/dummy_product.jpg',
    category: 'Food',
    tags: ['honey', 'organic', 'sweet'],
  },
];

const ProductModal = ({ open, onClose, store, products: PRODUCTS, onUpdateProduct, onPublishNews }) => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsProduct, setNewsProduct] = useState(null);
  const [showNewsCardModal, setShowNewsCardModal] = useState(false);
  const [newsCardProduct, setNewsCardProduct] = useState(null);

  // Dummy news for demo
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

  useEffect(() => {
    if (PRODUCTS?.length) {
      setProducts(PRODUCTS);
    } else {
      setProducts(dummyProducts);
    }
  }, [open, PRODUCTS]);

  if (!open && !showNewsModal && !showNewsCardModal) return null;

  const handleDelete = (product) => {
    setProducts((prev) => prev.filter((p) => p !== product));
  };

  const handleUpdate = (product) => {
    if (onUpdateProduct) {
      onUpdateProduct(product);
    }
  };

  const handlePublishNews = (product) => {
    if (onPublishNews) {
      onPublishNews(product);
    } else {
      setNewsProduct(product);
      setShowNewsModal(true);
    }
  };

  const handleNewsSubmit = (newsData) => {
    // TODO: Integrate with backend or update state as needed
    setShowNewsModal(false);
    setNewsProduct(null);
    // Optionally show a success message or update product/news state
  };

  const handleNewsGoBack = () => {
    setShowNewsModal(false);
    setNewsProduct(null);
  };

  const handleNewsCancel = () => {
    setShowNewsModal(false);
    setNewsProduct(null);
  };

  const handleViewAllNews = (product) => {
    setShowNewsCardModal(true);
    setNewsCardProduct(product);
  };

  const handleCloseNewsCardModal = () => {
    setShowNewsCardModal(false);
    setNewsCardProduct(null);
  };

  return (
    <>
      <NewsFormModal
        open={showNewsModal}
        onClose={handleNewsCancel}
        productId={newsProduct?.id}
        news={null}
        onSubmit={handleNewsSubmit}
        onGoBack={handleNewsGoBack}
        onCancel={handleNewsCancel}
      />
      <NewsCardModal
        open={showNewsCardModal}
        onClose={handleCloseNewsCardModal}
        newsList={dummyNews}
      />
      {!showNewsModal && !showNewsCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800/90 rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto border border-gray-700/50">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold transition-colors duration-200"
              onClick={onClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Products for {store?.name}
            </h2>
            <div>
              {products && products.length > 0 ? (
                products.map((product, idx) => (
                  <ProductCard
                    key={idx}
                    product={product}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onPublishNews={handlePublishNews}
                    onViewAllNews={handleViewAllNews}
                  />
                ))
              ) : (
                <div className="text-gray-400 text-center py-8">No products found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
