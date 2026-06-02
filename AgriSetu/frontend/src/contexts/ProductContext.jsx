import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all products (for customers)
  const getAllProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const { data } = await axios.get(`/api/products?${params.toString()}`);
      return data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch products';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get farmer's products
  const getFarmerProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const { data } = await axios.get(`/api/products/my-products?${params.toString()}`);
      
      setProducts(data.data.products);
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Handle authentication errors
      if (error?.response?.status === 401) {
        toast.error('Please login again to access your products');
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return;
      }
      
      const message = error?.response?.data?.message || 'Failed to fetch your products';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/products', productData);
      toast.success('Product created successfully!');
      return data.data.product;
    } catch (error) {
      // Handle authentication errors
      if (error?.response?.status === 401) {
        toast.error('Please login again to create products');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return;
      }
      
      const message = error?.response?.data?.message || 'Failed to create product';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/products/${id}`, productData);
      toast.success('Product updated successfully!');
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === id ? data.data.product : product
      ));
      
      return data.data.product;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update product';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted successfully!');
      
      // Update local state
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete product';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a single product
  const getProduct = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      return data.data.product;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch product';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      getAllProducts,
      getFarmerProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      getProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
