import React, { useState, useEffect } from 'react';

const NewsForm = ({ productId, news, handleGoBack, handleSubmit, handleCancel }) => {
  const [form, setForm] = useState({
    product: productId || '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (news) {
      setForm({
        product: news.product || productId || '',
        title: news.title || '',
        description: news.description || '',
      });
    } else if (productId) {
      setForm((prev) => ({ ...prev, product: productId }));
    }
  }, [news, productId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('Title and Description are required.');
      return;
    }
    if (handleSubmit) handleSubmit(form);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-gray-700/50 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {news ? 'Update News' : 'Publish News'}
      </h2>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Title *</label>
        <input 
          name="title" 
          value={form.title} 
          onChange={onChange} 
          required 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        />
      </div>
      <div>
        <label className="block font-medium mb-1 text-gray-200">Description *</label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={onChange} 
          required 
          className="w-full border border-gray-600/50 rounded-lg px-3 py-2 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
          rows="4"
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
        <button 
          type="submit" 
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default NewsForm;
