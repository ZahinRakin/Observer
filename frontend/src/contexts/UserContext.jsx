import React, { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem('user');
    console.log('🔍 DEBUG - UserContext: Initializing from localStorage');
    console.log('🔍 DEBUG - UserContext: Stored user data:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔍 DEBUG - UserContext: Parsed user data:', parsedUser);
        console.log('🔍 DEBUG - UserContext: User ID:', parsedUser?._id);
        return parsedUser;
      } catch (error) {
        console.error('🔍 DEBUG - UserContext: Error parsing stored user:', error);
        return null;
      }
    }
    console.log('🔍 DEBUG - UserContext: No stored user found');
    return null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    console.log('🔍 DEBUG - UserContext: User state changed:', user);
    console.log('🔍 DEBUG - UserContext: User ID:', user?._id);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('🔍 DEBUG - UserContext: User saved to localStorage');
    } else {
      localStorage.removeItem('user');
      console.log('🔍 DEBUG - UserContext: User removed from localStorage');
    }
  }, [user]);

  // Wrap setUser to keep localStorage in sync
  const setUser = (userData) => {
    console.log('🔍 DEBUG - UserContext: setUser called with:', userData);
    setUserState(userData);
  };

  console.log('🔍 DEBUG - UserContext: Rendering with user:', user);

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