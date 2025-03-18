// src/services/ProductService.js
import axios from 'axios';
import { API_URL } from './config';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products/list`);
      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data.data
        };
      }
      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching products'
      };
    }
  },

  // Thêm sản phẩm mới
  addProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_URL}/products/add`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Add product response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response?.data); // Debug log
      throw error.response?.data || error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/products/edit/${id}`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/products/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error.response?.data || error;
    }
  },

  // Upload media (images/videos)
  uploadMedia: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      // Sửa đường dẫn API theo đúng route trong api.js
      const response = await axios.post(`${API_URL}/upload/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status === 200) {
        return {
          status: 200,
          data: response.data.mediaUrls
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  },
};