import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, handleGoBack, handleSubmit, handleCancel, handlePublishNews }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    tags: '', // comma separated for input, will split to array on submit
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        category: product.category || '',
        tags: product.tags ? product.tags.join(', ') : '',
      });
    }
  }, [product]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Name is required.');
      return;
    }
    const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (handleSubmit) handleSubmit({ ...form, tags: tagsArr });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-gray-700/50 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {product ? 'Update Product' : 'Add Product'}
      </h2>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Name *</label>
        <input 
          name="name" 
          value={form.name} 
          onChange={onChange} 
          required 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Description</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={onChange} 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
          rows="3"
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Image URL</label>
        <input 
          name="image" 
          value={form.image} 
          onChange={onChange} 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Category</label>
        <input 
          name="category" 
          value={form.category} 
          onChange={onChange} 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Tags (comma separated)</label>
        <input 
          name="tags" 
          value={form.tags} 
          onChange={onChange} 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button 
          type="button" 
          onClick={handleGoBack} 
          className="px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 border border-gray-500/50"
        >
          Go Back
        </button>
        <button 
          type="button" 
          onClick={handleCancel} 
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg font-medium"
        >
          Cancel
        </button>
        {product && handlePublishNews && (
          <button
            type="button"
            onClick={() => handlePublishNews(product)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
          >
            Publish News
          </button>
        )}
        <button 
          type="submit" 
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg font-medium"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
