import React from 'react';

/**
 * DashboardSkeleton - Common layout for admin and customer dashboards
 * Usage: Wrap your dashboard pages with this skeleton
 */
const DashboardSkeleton = ({ sidebar, header, children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-4 py-3">
          {header}
        </header>
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
