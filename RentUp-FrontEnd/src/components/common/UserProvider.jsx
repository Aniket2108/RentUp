import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user1 = localStorage.getItem('user');
    const token1 = localStorage.getItem('token');
    if (user1 !== null) {
      setUser(JSON.parse(user1));
    }
    if (token1 !== null) {
      setToken(token1);
    }
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};



export const useUser = () => useContext(UserContext);


