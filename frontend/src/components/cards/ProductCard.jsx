import React from 'react';

/**
 * ProductCard - Card component to display a single product
 * Props: product (object with fields: name, description, image, category, tags)
 */
const ProductCard = ({ product, onDelete, onUpdate, onPublishNews }) => {
  const handleDelete = () => {
    if (onDelete) onDelete(product);
  };
  const handleUpdate = () => {
    if (onUpdate) onUpdate(product);
  };
  const handlePublishNews = () => {
    if (onPublishNews) onPublishNews(product);
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
        {product.category && <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>}
        {product.tags && product.tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Delete</button>
        <button onClick={handleUpdate} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Update</button>
        <button onClick={handlePublishNews} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Publish News</button>
      </div>
    </div>
  );
};

export default ProductCard;
