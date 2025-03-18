import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        const token = localStorage.getItem('accessToken');
        
        if (userInfo && token) {
          const parsedUser = JSON.parse(userInfo);
          if (parsedUser.role === 'admin') {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Nếu không phải admin, xóa thông tin và chuyển về login
            localStorage.clear();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (userData.role === 'admin') {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('userId', userData.id);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);