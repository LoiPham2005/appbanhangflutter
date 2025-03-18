import { API_URL } from './URL_API';

export const voucherService = {
  // Lấy danh sách sản phẩm
  getVoucher: async () => {
    try {
      const response = await fetch(`${API_URL}/api/voucher/list`);
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
      console.error("Error fetching voucher:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm sản phẩm mới
  addVoucher: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/api/voucher/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding voucher:", error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateVoucher: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/api/voucher/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteVoucher: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/voucher/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw error;
    }
  },

  // lấy theo id 
  getVoucherById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/voucher/getbyid/${id}`);
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
      console.error("Error fetching voucher by ID:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }
};