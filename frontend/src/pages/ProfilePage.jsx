import React, { useState, useEffect } from 'react';
import { Edit2, ArrowLeft, Trash2, Mail, User, Shield } from 'lucide-react';

// Dummy user data for demo
const dummyProfile = {
  fname: 'John',
  lname: 'Doe',
  email: 'john.doe@email.com',
  username: 'johndoe',
  password: '',
  account_type: 'storeowner',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
};

// Simple ProfileForm component for demo
const ProfileForm = ({ profile, handleSubmit, handleCancel }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    handleSubmit(formData);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
        <select
          name="account_type"
          value={formData.account_type}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white"
        >
          <option value="storeowner">Store Owner</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={onSubmit}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium border border-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProfilePage = ({ user = dummyProfile, onBack, editMode: initialEditMode = false }) => {
  const [editMode, setEditMode] = useState(initialEditMode);
  const [profile, setProfile] = useState(user);

  // Update editMode when the prop changes
  useEffect(() => {
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  const handleEditProfile = () => setEditMode(true);
  const handleCancelEdit = () => setEditMode(false);
  const handleSubmitEdit = (form) => {
    setProfile({ ...profile, ...form });
    setEditMode(false);
  };
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deleted (demo)');
    }
  };

  // Reset editMode when going back
  const handleBack = () => {
    setEditMode(false);
    if (onBack) onBack();
  };

  const getAccountTypeDisplay = (type) => {
    switch (type) {
      case 'storeowner': return 'Store Owner';
      case 'customer': return 'Customer';
      case 'admin': return 'Administrator';
      default: return type;
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'storeowner': return 'bg-purple-900/50 text-purple-300 border-purple-700/30';
      case 'customer': return 'bg-green-900/50 text-green-300 border-green-700/30';
      case 'admin': return 'bg-red-900/50 text-red-300 border-red-700/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Profile</h1>
          <div className="w-16"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
          {/* Cover Image */}
          <div 
            className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative"
            style={{
              backgroundImage: profile.cover_image ? `url(${profile.cover_image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={`${profile.fname} ${profile.lname}`}
                  className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>
            </div>

            {!editMode ? (
              <>
                {/* Profile Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-200 mb-2">
                    {profile.fname} {profile.lname}
                  </h2>
                  <p className="text-gray-400 text-lg mb-3">@{profile.username}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getAccountTypeColor(profile.account_type)}`}>
                    <Shield size={14} className="mr-1" />
                    {getAccountTypeDisplay(profile.account_type)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <Mail size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Email</p>
                      <p className="text-gray-400">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Username</p>
                      <p className="text-gray-400">{profile.username}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleEditProfile}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center gap-2 bg-red-900/30 text-red-400 py-3 px-6 rounded-lg hover:bg-red-900/50 transition-colors font-medium border border-red-700/30"
                  >
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-200 mb-6">Edit Profile</h3>
                <ProfileForm 
                  profile={profile} 
                  handleSubmit={handleSubmitEdit} 
                  handleCancel={handleCancelEdit} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;