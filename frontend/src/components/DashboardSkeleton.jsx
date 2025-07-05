import React from 'react';

/**
 * DashboardSkeleton - Common layout for admin and customer dashboards
 * Usage: Wrap your dashboard pages with this skeleton
 */
const DashboardSkeleton = ({ sidebar, header, children, footer }) => {
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header - fixed at top */}
      <header className="flex-shrink-0 border-b border-gray-700/50 shadow-sm z-20">
        {header}
      </header>
      
      {/* Main content area - flex to fill remaining space */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed on left */}
        <aside className="w-64 hidden md:block flex-shrink-0 border-r border-gray-700/50 shadow-sm z-10">
          {sidebar}
        </aside>
        
        {/* Main Content Area - scrollable */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Content wrapper with padding */}
          <div className="p-6">
            {children}
          </div>
          
          {/* Footer - at end of main content */}
          {footer && (
            <div className="px-6 pb-6">
              <footer className="border-t border-gray-700/50 shadow-sm bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
                {footer}
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;