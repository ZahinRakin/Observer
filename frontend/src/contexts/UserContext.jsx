import React, { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Wrap setUser to keep localStorage in sync
  const setUser = (userData) => {
    setUserState(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Add this custom hook at the bottom of the file
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};