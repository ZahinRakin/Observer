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
    <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-semibold mb-2">{product ? 'Update Product' : 'Add Product'}</h2>
      <div>
        <label className="block font-medium mb-1">Name *</label>
        <input name="name" value={form.name} onChange={onChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <input name="image" value={form.image} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Category</label>
        <input name="category" value={form.category} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Tags (comma separated)</label>
        <input name="tags" value={form.tags} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={handleGoBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Go Back</button>
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
        {product && handlePublishNews && (
          <button
            type="button"
            onClick={() => handlePublishNews(product)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Publish News
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
};

export default ProductForm;
