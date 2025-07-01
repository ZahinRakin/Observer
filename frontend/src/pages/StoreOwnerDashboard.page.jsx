import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { UserContext } from '../contexts/UserContext';
import avatar from "/avatar.jpg"; 
import axios from 'axios';
import StoreCard from '../components/cards/StoreCard';
import StoreForm from '../components/forms/StoreForm';
import ProfilePage from './ProfilePage';

const StoreOwnerSidebar = ({ activeTab, onTabChange }) => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Store Owner Menu</li>
      <li className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('dashboard')}>Dashboard</li>
      <li className={`cursor-pointer ${activeTab === 'stores' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('stores')}>Stores</li>
    </ul>
  </nav>
);

const StoreOwnerHeader = ({ user, onViewProfile, onEditProfile }) => {
  const { setUser } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuHideTimeout = React.useRef();

  const handleMouseEnter = () => {
    if (menuHideTimeout.current) clearTimeout(menuHideTimeout.current);
    setShowMenu(true);
  };
  const handleMouseLeave = () => {
    menuHideTimeout.current = setTimeout(() => setShowMenu(false), 200); // 200ms delay
  };
  const handleLogout = () => {
    setUser(null);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/signin';
  };
  React.useEffect(() => {
    return () => { if (menuHideTimeout.current) clearTimeout(menuHideTimeout.current); };
  }, []);
  return (
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded shadow relative">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">Store Owner Dashboard</h1>
        <span className="text-gray-600 text-sm">Welcome, {user ? user.username : 'Store Owner'}</span>
      </div>
      <div className="flex items-center gap-3 relative">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="focus:outline-none">
            <img
              src={user?.avatar || avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
            />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 animate-fade-in flex flex-col"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                onClick={onViewProfile}
              >
                View Profile
              </button>
              <button
                className="px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                onClick={onEditProfile}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const StoreOwnerFooter = () => (
  <div>Store Owner Portal © 2025</div>
);

const dummyStores = [
  {
    id: 1,
    name: 'Goat Farm',
    description: 'A premium goat farm with organic products.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    location: '123 Farm Lane, Countryside',
    phone: '+1 555-1234',
    email: 'info@goatfarm.com',
    website: 'https://goatfarm.com',
    facebook: 'https://facebook.com/goatfarm',
    instagram: 'https://instagram.com/goatfarm',
  },
  {
    id: 2,
    name: 'Urban Trees',
    description: 'Your local tree nursery and garden center.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    location: '456 City Ave, Metropolis',
    phone: '+1 555-5678',
    email: 'contact@urbantrees.com',
    website: 'https://urbantrees.com',
    facebook: 'https://facebook.com/urbantrees',
    instagram: 'https://instagram.com/urbantrees',
  },
  {
    id: 3,
    name: 'Fresh Market',
    description: 'Organic produce and local goods.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    location: '789 Market St, Downtown',
    phone: '+1 555-9012',
    email: 'hello@freshmarket.com',
    website: 'https://freshmarket.com',
    facebook: 'https://facebook.com/freshmarket',
    instagram: 'https://instagram.com/freshmarket',
  },
];

const RenderStores = ({ user }) => {
  const [stores, setStores] = useState(dummyStores);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const handleCreateStore = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  const handleGoBack = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleSubmit = (form) => {
    if (editingStore) {
      // Update existing store
      setStores(prev => prev.map(s => s.id === editingStore.id ? { ...s, ...form } : s));
    } else {
      // Create new store
      setStores(prev => [{ ...form, id: Date.now() }, ...prev]);
    }
    setShowForm(false);
    setEditingStore(null);
  };

  const handleUpdateStore = (store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      {showForm ? (
        <StoreForm
          store={editingStore}
          handleGoBack={handleGoBack}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreateStore}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow"
            >
              + Create New Store
            </button>
          </div>
          {stores.length > 0 ? (
            <div className="flex flex-col w-full">
              {stores.map(store => (
                <StoreCard key={store.id || store.name} store={store} onUpdate={handleUpdateStore} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No stores found. Please create a store to manage.
            </div>
          )}
        </>
      )}
    </div>
  );
};

const RenderDashboard = ({ user }) => {
  return (
    <div className="p-6 w-full flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-100 via-white to-pink-100 rounded-2xl shadow-lg p-6">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow">Welcome, {user?.username || 'Store Owner'}!</h2>
          <p className="text-gray-600 text-lg mb-2">Here's a quick overview of your store's performance and recent activity.</p>
        </div>
        <div className="flex-shrink-0">
          {/* Store Illustration */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#E0E7FF" />
            <rect x="25" y="40" width="50" height="30" rx="6" fill="#6366F1" />
            <rect x="35" y="55" width="30" height="15" rx="3" fill="#A5B4FC" />
            <rect x="40" y="45" width="20" height="10" rx="2" fill="#FBBF24" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-600 mb-2">3</span>
          <span className="text-gray-500">Stores</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-600 mb-2">12</span>
          <span className="text-gray-500">Products</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-4xl font-bold text-pink-600 mb-2">5</span>
          <span className="text-gray-500">News Published</span>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 17V7m4 10V3m4 14v-7m4 7V9m4 8v-4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="font-semibold text-blue-700">Sales Trend</span>
          </div>
          <div className="w-full h-40 flex items-end gap-2">
            {/* Simple bar chart illustration */}
            <div className="bg-blue-200 rounded w-6 h-12" />
            <div className="bg-blue-400 rounded w-6 h-24" />
            <div className="bg-blue-300 rounded w-6 h-16" />
            <div className="bg-blue-500 rounded w-6 h-32" />
            <div className="bg-blue-300 rounded w-6 h-20" />
            <div className="bg-blue-400 rounded w-6 h-28" />
          </div>
          <div className="text-xs text-gray-400 mt-2">(Demo data)</div>
        </div>
        {/* Customer Growth Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6m0 0l-3 3m3-3l3 3M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="font-semibold text-green-700">Customer Growth</span>
          </div>
          <div className="w-full h-40 flex items-end gap-2">
            {/* Simple line chart illustration */}
            <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,70 40,60 80,50 120,30 160,40 200,20" fill="none" stroke="#10B981" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="0" cy="70" r="3" fill="#10B981" />
              <circle cx="40" cy="60" r="3" fill="#10B981" />
              <circle cx="80" cy="50" r="3" fill="#10B981" />
              <circle cx="120" cy="30" r="3" fill="#10B981" />
              <circle cx="160" cy="40" r="3" fill="#10B981" />
              <circle cx="200" cy="20" r="3" fill="#10B981" />
            </svg>
          </div>
          <div className="text-xs text-gray-400 mt-2">(Demo data)</div>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="flex flex-col items-center mt-8">
        <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="90" rx="80" ry="10" fill="#E0E7FF" />
          <rect x="60" y="40" width="60" height="40" rx="8" fill="#FBBF24" />
          <rect x="80" y="60" width="20" height="20" rx="4" fill="#6366F1" />
          <circle cx="90" cy="60" r="6" fill="#A5B4FC" />
        </svg>
        <div className="text-gray-400 mt-2">Your store at a glance</div>
      </div>
    </div>
  );
};

const StoreOwnerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);

  let content;
  if (showProfilePage) {
    content = (
      <ProfilePage
        user={user}
        onBack={() => setShowProfilePage(false)}
        editMode={editProfileMode}
      />
    );
  } else if (activeTab === 'dashboard') content = <RenderDashboard user={user} />;
  else if (activeTab === 'stores') content = <RenderStores user={user} />;

  return (
    <DashboardSkeleton
      sidebar={<StoreOwnerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={
        <StoreOwnerHeader
          user={user}
          onViewProfile={() => { setShowProfilePage(true); setEditProfileMode(false); }}
          onEditProfile={() => { setShowProfilePage(true); setEditProfileMode(true); }}
        />
      }
      footer={<StoreOwnerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default StoreOwnerDashboard;
