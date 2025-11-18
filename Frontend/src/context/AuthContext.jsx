import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Try to get auth data from localStorage on initial load
    const storedAuth = localStorage.getItem('auth');
    try {
      return storedAuth ? JSON.parse(storedAuth) : { token: null, user: null };
    } catch (e) {
      console.error('Error parsing auth from localStorage', e);
      return { token: null, user: null };
    }
  });
  
  // This state prevents redirects before auth is checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth));
      } catch (e) {
        console.error('Error parsing auth from localStorage', e);
        localStorage.removeItem('auth');
        setAuth({ token: null, user: null });
      }
    }
    setLoading(false);
  }, []);

  
  const login = (data) => {
    // data should be { token, user } from the backend
    const authData = { token: data.token, user: data.user };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  // This is the REGISTER function 
  const register = (data) => {
    const authData = { token: data.token, user: data.user };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  // This is the LOGOUT function
  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!auth.token,
        user: auth.user,
        token: auth.token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

