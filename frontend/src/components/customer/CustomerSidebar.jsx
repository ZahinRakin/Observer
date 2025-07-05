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

export default CustomerSidebar;