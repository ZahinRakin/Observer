import React, { useState } from 'react';
import ProfileForm from '../components/forms/ProfileForm';

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

const ProfilePage = ({ user = dummyProfile, onBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(user);

  const handleEditProfile = () => setEditMode(true);
  const handleCancelEdit = () => setEditMode(false);
  const handleSubmitEdit = (form) => {
    // TODO: Communicate with backend to update profile
    setProfile({ ...profile, ...form });
    setEditMode(false);
  };
  const handleDeleteAccount = () => {
    // TODO: Communicate with backend to delete account
    alert('Account deleted (demo)');
  };
  const handleLogout = () => {
    // TODO: Communicate with backend to logout
    alert('Logged out (demo)');
  };

  return (
    <div className="relative max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 text-gray-500 hover:text-blue-600 text-2xl font-bold z-10"
        onClick={onBack}
        aria-label="Back"
      >
        &#8592;
      </button>
      {/* Cover Image */}
      {profile.cover_image && (
        <div className="h-40 w-full bg-gray-200 relative">
          <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      <div className="p-8 pt-4 flex flex-col items-center">
        {/* Avatar */}
        <div className="-mt-16 mb-4 relative">
          <img
            src={profile.avatar || '/avatar.jpg'}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
          />
        </div>
        {/* View or Edit Mode */}
        {!editMode ? (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-1">{profile.fname} {profile.lname}</h2>
            <div className="text-gray-500 mb-2">@{profile.username}</div>
            <div className="text-gray-600 mb-2">{profile.email}</div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mr-2">
                {profile.account_type === 'storeowner' ? 'Store Owner' : 'Client'}
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleEditProfile} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit Profile</button>
              <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete Account</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Logout</button>
            </div>
          </>
        ) : (
          <ProfileForm profile={profile} handleSubmit={handleSubmitEdit} handleCancel={handleCancelEdit} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
