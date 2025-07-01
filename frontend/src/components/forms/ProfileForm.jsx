import React, { useState, useEffect } from 'react';

const ProfileForm = ({ profile, handleSubmit, handleCancel }) => {
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    username: '',
    password: '',
    account_type: '',
    avatar: '',
    cover_image: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fname: profile.fname || '',
        lname: profile.lname || '',
        email: profile.email || '',
        username: profile.username || '',
        password: '', // Do not prefill password for security
        account_type: profile.account_type || '',
        avatar: profile.avatar || '',
        cover_image: profile.cover_image || '',
      });
    }
  }, [profile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.fname.trim() || !form.lname.trim() || !form.email.trim() || !form.username.trim() || !form.account_type.trim()) {
      alert('Please fill all required fields.');
      return;
    }
    if (handleSubmit) handleSubmit(form);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">Edit Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">First Name *</label>
          <input name="fname" value={form.fname} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Last Name *</label>
          <input name="lname" value={form.lname} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Email *</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Username *</label>
          <input name="username" value={form.username} onChange={onChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="Leave blank to keep current password" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Account Type *</label>
          <select name="account_type" value={form.account_type} onChange={onChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select type</option>
            <option value="client">Client</option>
            <option value="storeowner">Store Owner</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Avatar URL</label>
          <input name="avatar" value={form.avatar} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Cover Image URL</label>
          <input name="cover_image" value={form.cover_image} onChange={onChange} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
};

export default ProfileForm;
