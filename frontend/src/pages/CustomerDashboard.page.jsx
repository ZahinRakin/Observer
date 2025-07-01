import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { UserContext } from '../contexts/UserContext';
import avatar from "/avatar.jpg"; 

const CustomerSidebar = ({ activeTab, onTabChange }) => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Customer Menu</li>
      <li className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('dashboard')}>Dashboard</li>
      <li className={`cursor-pointer ${activeTab === 'news' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('news')}>News</li>
      <li className={`cursor-pointer ${activeTab === 'products' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('products')}>Products</li>
    </ul>
  </nav>
);

const CustomerHeader = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const handleLogout = () => {
    setUser(null);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/signin';
  };
  return (
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded shadow">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">Customer Dashboard</h1>
        <span className="text-gray-600 text-sm">Welcome, {user ? user.username : 'Customer'}</span>
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

const CustomerFooter = () => (
  <div>Customer Portal © 2025</div>
);

const RenderDashboard = ({ user }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">Overview</h2>
    <p>This is the customer dashboard main content area.</p>
    {user && (
      <div className="mt-4 p-4 bg-blue-50 rounded">Logged in as: <b>{user.username}</b></div>
    )}
  </div>
);

const RenderNews = () => (
  <div>
    <h2 className="text-lg font-bold mb-4">News</h2>
    <p>Latest news for customers.</p>
  </div>
);

const RenderProducts = () => (
  <div>
    <h2 className="text-lg font-bold mb-4">Products</h2>
    <p>Browse and manage your products here.</p>
  </div>
);

const CustomerDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  let content;
  if (activeTab === 'dashboard') content = <RenderDashboard user={user} />;
  else if (activeTab === 'news') content = <RenderNews />;
  else if (activeTab === 'products') content = <RenderProducts />;

  return (
    <DashboardSkeleton
      sidebar={<CustomerSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={<CustomerHeader user={user} />}
      footer={<CustomerFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default CustomerDashboard;
