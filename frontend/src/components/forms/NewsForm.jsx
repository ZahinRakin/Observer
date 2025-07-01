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
    <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-semibold mb-2">{news ? 'Update News' : 'Publish News'}</h2>
      <div>
        <label className="block font-medium mb-1">Title *</label>
        <input name="title" value={form.title} onChange={onChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Description *</label>
        <textarea name="description" value={form.description} onChange={onChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={handleGoBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Go Back</button>
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
};

export default NewsForm;
