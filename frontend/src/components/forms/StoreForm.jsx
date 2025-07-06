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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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
      if (store.image) {
        setImagePreview(store.image);
      }
    }
  }, [store]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, image: '' }));
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
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
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
        {store ? 'Update Store' : 'Create Store'}
      </h2>
      
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 text-gray-200">
                Store Name <span className="text-red-400">*</span>
              </label>
              <input 
                name="name" 
                value={form.name} 
                onChange={onChange} 
                required 
                placeholder="Enter store name"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 text-gray-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={onChange} 
                required 
                placeholder="Describe your store"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200" 
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
            Store Image
          </h3>
          
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Store preview" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600/50"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600/50 border-dashed rounded-lg cursor-pointer bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-gray-200">Location</label>
              <input 
                name="location" 
                value={form.location} 
                onChange={onChange} 
                placeholder="Store address"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-200">Phone</label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={onChange} 
                placeholder="Phone number"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-200">Email</label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={onChange} 
                placeholder="contact@store.com"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-200">Website</label>
              <input 
                name="website" 
                type="url"
                value={form.website} 
                onChange={onChange} 
                placeholder="https://www.store.com"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
            Social Media
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2 text-gray-200">Facebook</label>
              <input 
                name="facebook" 
                value={form.facebook} 
                onChange={onChange} 
                placeholder="Facebook page URL"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2 text-gray-200">Instagram</label>
              <input 
                name="instagram" 
                value={form.instagram} 
                onChange={onChange} 
                placeholder="Instagram profile URL"
                className="w-full border border-gray-600/50 rounded-lg px-4 py-3 bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-end pt-6 border-t border-gray-600/30">
          <button 
            type="button" 
            onClick={handleGoBack} 
            className="px-6 py-3 bg-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 border border-gray-500/50 font-medium"
          >
            Go Back
          </button>
          <button 
            type="button" 
            onClick={handleCancel} 
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
          >
            {store ? 'Update Store' : 'Create Store'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StoreForm;