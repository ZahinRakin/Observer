import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.jsx';
import avatar from "/avatar.jpg"; 

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

export default CustomerHeader;