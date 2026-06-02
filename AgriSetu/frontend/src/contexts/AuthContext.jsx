import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set up axios interceptor to include token in all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Set up axios interceptor to automatically include token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/v1/auth/login', { email, password });
      const { user: apiUser, token, refreshToken } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(apiUser));
      // Set axios header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(apiUser);
      toast.success(`Login successful! Welcome back, ${apiUser.first_name || apiUser.name || 'User'}!`);
      return apiUser;
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const signup = async (email, password, name, role) => {
    try {
      // Provide required backend fields with sensible defaults
      const payload = {
        email,
        password,
        firstName: name || 'User',
        lastName: (name && name.split(' ')[1]) || 'User',
        phone: '9999999999', // Valid 10-digit phone
        role: role === 'admin' ? 'customer' : role,
        // Only send farm fields for farmers and only those allowed by backend validation
        farmName: role === 'farmer' ? 'My Farm' : undefined,
        addressLine1: 'Default Address Line 1',
        addressLine2: '',
        city: 'YourCity',
        state: 'YourState',
        postalCode: '560001', // Valid 6-digit postal code
        country: 'India'
      };
      const { data } = await axios.post('/api/v1/auth/register', payload);
      const { user: apiUser, token, refreshToken } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(apiUser));
      // Set axios header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(apiUser);
      toast.success(`Registration successful! Welcome to Agri-Setu, ${apiUser.first_name || apiUser.name || 'User'}!`);
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    // Clear user-specific cart data
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
