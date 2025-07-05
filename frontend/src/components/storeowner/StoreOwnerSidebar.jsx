const StoreOwnerSidebar = ({ activeTab, onTabChange }) => (
  <nav className="p-4">
    <ul>
      <li className="mb-2 font-bold">Store Owner Menu</li>
      <li className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('dashboard')}>Dashboard</li>
      <li className={`cursor-pointer ${activeTab === 'stores' ? 'text-blue-600 font-semibold' : ''}`} onClick={() => onTabChange('stores')}>Stores</li>
    </ul>
  </nav>
);

export default StoreOwnerSidebar; 