import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { UserContext } from '../contexts/UserContext';
import avatar from "/avatar.jpg"; 
import axios from 'axios';
import StoreCard from '../components/cards/StoreCard';

const StoreOwnerSidebar = ({ activeTab, onTabChange }) => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Store Owner Menu</li>
      <li className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('dashboard')}>Dashboard</li>
      <li className={`cursor-pointer ${activeTab === 'stores' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('stores')}>Stores</li>
    </ul>
  </nav>
);

const StoreOwnerHeader = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const handleLogout = () => {
    setUser(null);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/signin';
  };
  return (
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded shadow">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">Store Owner Dashboard</h1>
        <span className="text-gray-600 text-sm">Welcome, {user ? user.username : 'Store Owner'}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="focus:outline-none">
          <img
            src={user?.avatar || avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        </button>
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
  // const [stores, setStores] = useState([]);
  // React.useEffect(() => {
  //   if (!user) return;
  //   const fetchStores = async () => {
  //     try {
  //       const response = await axios.get(`/api/v1/storeowner/${user.id}/stores`);
  //       setStores(response?.data || []);
  //     } catch (error) {
  //       console.error("Error fetching stores:", error);
  //     }
  //   };
  //   fetchStores();
  // }, [user]);
  const stores = dummyStores;
  return (
    <div className="p-4">
      {stores.length > 0 ? (
        <div className="flex flex-col w-full">
          {stores.map(store => (
            <StoreCard key={store.id || store.name} store={store} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No stores found. Please create a store to manage.
        </div>
      )}
    </div>
  );
};

const RenderDashboard = ({ user }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <p className="text-gray-600">Welcome to your dashboard. Here you can manage your stores, view analytics, and more.</p>
    </div>
  );
};

const StoreOwnerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  let content;
  if (activeTab === 'dashboard') content = <RenderDashboard user={user} />;
  else if (activeTab === 'stores') content = <RenderStores user={user} />;

  return (
    <DashboardSkeleton
      sidebar={<StoreOwnerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={<StoreOwnerHeader user={user} />}
      footer={<StoreOwnerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default StoreOwnerDashboard;
