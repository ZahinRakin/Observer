import React, { useContext, useState } from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { UserContext } from '../contexts/UserContext';
import avatar from "/avatar.jpg";

const AdminSidebar = ({ activeTab, onTabChange }) => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Admin Menu</li>
      <li className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('dashboard')}>Dashboard</li>
      <li className={`cursor-pointer ${activeTab === 'users' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('users')}>Users</li>
      <li className={`cursor-pointer ${activeTab === 'settings' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('settings')}>Settings</li>
    </ul>
  </nav>
);

const AdminHeader = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const handleLogout = () => {
    setUser(null);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/signin';
  };
  return (
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-3 rounded shadow">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <span className="text-gray-600 text-sm">Welcome, {user ? user.username : 'Admin'}</span>
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

const AdminFooter = () => (
  <div>Admin Panel © 2025</div>
);

const RenderDashboard = ({ user }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">Overview</h2>
    <p>This is the admin dashboard main content area.</p>
    {user && (
      <div className="mt-4 p-4 bg-blue-50 rounded">Logged in as: <b>{user.username}</b></div>
    )}
  </div>
);

const RenderUsers = () => (
  <div>
    <h2 className="text-lg font-bold mb-4">Users</h2>
    <p>Manage users here.</p>
  </div>
);

const RenderSettings = () => (
  <div>
    <h2 className="text-lg font-bold mb-4">Settings</h2>
    <p>Admin settings go here.</p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  let content;
  if (activeTab === 'dashboard') content = <RenderDashboard user={user} />;
  else if (activeTab === 'users') content = <RenderUsers />;
  else if (activeTab === 'settings') content = <RenderSettings />;

  return (
    <DashboardSkeleton
      sidebar={<AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
      header={<AdminHeader user={user} />}
      footer={<AdminFooter />}
    >
      {content}
    </DashboardSkeleton>
  );
};

export default AdminDashboard;
