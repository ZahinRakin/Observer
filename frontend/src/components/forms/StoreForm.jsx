import React, { useState, useEffect } from 'react';

const StoreForm = ({ store, handleGoBack, handleSubmit, handleCancel }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
  });

  useEffect(() => {
    if (store) {
      setForm({
        name: store.name || '',
        description: store.description || '',
        image: store.image || '',
        location: store.location || '',
        phone: store.phone || '',
        email: store.email || '',
        website: store.website || '',
        facebook: store.facebook || '',
        instagram: store.instagram || '',
      });
    }
  }, [store]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      alert('Name and Description are required.');
      return;
    }
    if (handleSubmit) handleSubmit(form);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-semibold mb-2">{store ? 'Update Store' : 'Create Store'}</h2>
      <div>
        <label className="block font-medium mb-1">Name *</label>
        <input name="name" value={form.name} onChange={onChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Description *</label>
        <textarea name="description" value={form.description} onChange={onChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <input name="image" value={form.image} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Location</label>
        <input name="location" value={form.location} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input name="email" value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Website</label>
        <input name="website" value={form.website} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Facebook</label>
        <input name="facebook" value={form.facebook} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Instagram</label>
        <input name="instagram" value={form.instagram} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={handleGoBack} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Go Back</button>
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
};

export default StoreForm;
