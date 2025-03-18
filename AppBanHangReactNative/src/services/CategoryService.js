import { API_URL } from './URL_API';

export const categoryService = {
  // Lấy danh sách sản phẩm
  getCategory: async () => {
    try {
      const response = await fetch(`${API_URL}/api/category/list`);
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
      console.error("Error fetching category:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm sản phẩm mới
  addCategory: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/api/category/add`, {
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
  updateCategory: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/api/category/edit/${id}`, {
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
  deleteCategory: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/category/delete/${id}`, {
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
  getCategoryById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/category/getbyid/${id}`);
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