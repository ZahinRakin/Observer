import React, { useState, useEffect } from 'react';
import { Edit2, ArrowLeft, Trash2, Mail, User, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import userService from '../services/userService';

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
const ProfileForm = ({ profile, handleSubmit, handleCancel, isLoading }) => {
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
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ProfilePage = ({ onBack, editMode: initialEditMode = false }) => {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(initialEditMode);
  const [profile, setProfile] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Update editMode when the prop changes
  useEffect(() => {
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  // Update profile when user changes
  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleEditProfile = () => setEditMode(true);
  const handleCancelEdit = () => {
    setEditMode(false);
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmitEdit = async (form) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage('');

      console.log('🔍 DEBUG - handleSubmitEdit called with form:', form);
      console.log('🔍 DEBUG - user.id:', user?.id);

      if (!user?.id) {
        setError('User ID not found. Please log in again.');
        return;
      }

      // Filter out empty fields and exclude password
      const updateData = {};
      Object.keys(form).forEach(key => {
        if (key !== 'password' && form[key] !== null && form[key] !== undefined && form[key] !== '') {
          updateData[key] = form[key];
        }
      });

      console.log('🔍 DEBUG - Filtered update data:', updateData);

      // Call backend API to update user
      const updatedUser = await userService.updateUser(user.id, updateData);
      console.log('🔍 DEBUG - Updated user from backend:', updatedUser);

      // Update local state and context
      const newUserData = { ...user, ...updatedUser };
      setProfile(newUserData);
      setUser(newUserData);

      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError('Failed to update profile: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        setError(null);

        if (!user?.id) {
          setError('User ID not found. Please log in again.');
          return;
        }

        await userService.deleteUser(user.id);
        
        // Clear user data and redirect
        setUser(null);
        localStorage.removeItem('user');
        
        // You might want to redirect to login page here
        alert('Account deleted successfully');
      } catch (err) {
        console.error('❌ Error deleting account:', err);
        setError('Failed to delete account: ' + (err.response?.data?.detail || err.message));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset editMode when going back
  const handleBack = () => {
    setEditMode(false);
    setError(null);
    setSuccessMessage('');
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

  // Show loading state if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-300 mb-2">Authentication Error</h2>
            <p className="text-red-200 mb-4">User data not found. Please log in again.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

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
                  src={profile.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
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
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-red-900/30 text-red-400 py-3 px-6 rounded-lg hover:bg-red-900/50 transition-colors font-medium border border-red-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  isLoading={isLoading}
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