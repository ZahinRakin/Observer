import React from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';

const AdminSidebar = () => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Admin Menu</li>
      <li>Dashboard</li>
      <li>Users</li>
      <li>Settings</li>
    </ul>
  </nav>
);

const AdminHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
    <span>Welcome, Admin</span>
  </div>
);

const AdminDashboard = () => (
  <DashboardSkeleton sidebar={<AdminSidebar />} header={<AdminHeader />}>
    <div>
      <h2 className="text-lg font-bold mb-4">Overview</h2>
      <p>This is the admin dashboard main content area.</p>
    </div>
  </DashboardSkeleton>
);

export default AdminDashboard;
