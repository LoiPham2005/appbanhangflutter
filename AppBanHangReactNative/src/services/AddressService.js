import { API_URL } from './URL_API';

export const addressService = {
  // Lấy danh sách sản phẩm
  getAddress: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/address/list?id_user=${userId}`);
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
      console.error("Error fetching addresses:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm sản phẩm mới
  addAddress: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/api/address/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateAddress: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/api/address/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteAddress: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/address/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // lấy theo id 
  getAddressById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/address/getbyid/${id}`);
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
      console.error("Error fetching category by ID:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }
};