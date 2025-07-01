import React, { useState, useEffect } from 'react';
import ProductCard from '../cards/ProductCard';

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

const ProductModal = ({ open, onClose, store, products }) => {
  // Always get products from store.products if available, else from propProducts, else dummyProducts

  const [products, setProducts] = useState(
    products || dummyProducts 
  );

  useEffect(() => {
    if (products) {
      setProducts(products);
    } else {
      setProducts(dummyProducts);
    }
  }, [productsFromStore, propProducts, open]);

  if (!open) return null;

  // Handler stubs
  const handleDelete = (product) => {
    setProducts((prev) => prev.filter((p) => p !== product));
  };
  const handleUpdate = (product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p === product ? { ...p, name: p.name + ' (Updated)' } : p
      )
    );
  };
  const handlePublishNews = (product) => {
    alert(`Publish news for: ${product.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
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
              />
            ))
          ) : (
            <div className="text-gray-400 text-center">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
