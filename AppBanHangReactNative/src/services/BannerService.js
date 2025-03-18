import { API_URL } from './URL_API';

export const BannerService = {
  // Lấy danh sách sản phẩm
  getBanners: async () => {
    try {
      const response = await fetch(`${API_URL}/api/banners/list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        data: data.data || [] // Đảm bảo luôn trả về mảng
      };
    } catch (error) {
      console.error("Error fetching banners:", error);
      return {
        success: false,
        data: [],
        message: error.message
      };
    }
  },

  // Thêm sản phẩm mới
  addBanners: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/api/banners/add`, {
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
  updateBanners: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/api/banners/edit/${id}`, {
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
  deleteBanners: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/banners/delete/${id}`, {
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
  getBannersById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/banners/getbyid/${id}`);
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