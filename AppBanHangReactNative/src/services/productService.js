import { API_URL } from './URL_API';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm dòng này

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 200) {
        return {
          success: true,
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm sản phẩm mới
  addProduct: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/api/products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      // const token = await AsyncStorage.getItem('accessToken');
      // if (!token) {
      //   throw new Error('No access token found');
      // }

      const response = await fetch(`${API_URL}/api/products/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      // const token = await AsyncStorage.getItem('accessToken');
      // if (!token) {
      //   throw new Error('No access token found');
      // }

      const response = await fetch(`${API_URL}/api/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // lấy theo id 
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/getbyid/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 200) {
        return {
          success: true,
          data: data.data
        };
      } else {
        return {
          success: false,
          message: data.message
        };
      }
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Tìm kiếm sản phẩm
  // Trong productService.js
  searchProducts: async (searchParams) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${API_URL}/api/products/search?${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.status === 200,
        data: data.data || [],
        message: data.message
      };
    } catch (error) {
      console.error("Search error:", error);
      return {
        success: false,
        data: [],
        message: error.message
      };
    }
  }
};