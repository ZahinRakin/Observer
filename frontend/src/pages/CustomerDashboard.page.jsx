import React from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';

const CustomerSidebar = () => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Customer Menu</li>
      <li>Home</li>
      <li>Orders</li>
      <li>Profile</li>
    </ul>
  </nav>
);

const CustomerHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Customer Dashboard</h1>
    <span>Welcome, Customer</span>
  </div>
);

const CustomerDashboard = () => (
  <DashboardSkeleton sidebar={<CustomerSidebar />} header={<CustomerHeader />}>
    <div>
      <h2 className="text-lg font-bold mb-4">Overview</h2>
      <p>This is the customer dashboard main content area.</p>
    </div>
  </DashboardSkeleton>
);

export default CustomerDashboard;
