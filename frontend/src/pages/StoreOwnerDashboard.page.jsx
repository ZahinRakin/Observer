import React from 'react';
import DashboardSkeleton from '../components/DashboardSkeleton';

const StoreOwnerSidebar = () => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Store Owner Menu</li>
      <li>Dashboard</li>
      <li>Inventory</li>
      <li>Sales</li>
    </ul>
  </nav>
);

const StoreOwnerHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Store Owner Dashboard</h1>
    <span>Welcome, Store Owner</span>
  </div>
);

const StoreOwnerDashboard = () => (
  <DashboardSkeleton sidebar={<StoreOwnerSidebar />} header={<StoreOwnerHeader />}>
    <div>
      <h2 className="text-lg font-bold mb-4">Overview</h2>
      <p>This is the store owner dashboard main content area.</p>
    </div>
  </DashboardSkeleton>
);

export default StoreOwnerDashboard;
