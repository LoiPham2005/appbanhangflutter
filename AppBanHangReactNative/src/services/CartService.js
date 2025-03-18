import { API_URL } from './URL_API';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export const cartService = {
  // Lấy danh sách sản phẩm
  getCart: async () => {
    try {
      const response = await fetch(`${API_URL}/api/carts/list`);
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
//   addCart: async (productData) => {
//     try {
//       const response = await fetch(`${API_URL}/api/carts/add`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData)
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error adding category:", error);
//       throw error;
//     }
//   },

addToCart: async (productData) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('accessToken');
        
        if (!userId) {
            throw new Error('User not logged in');
        }

        const cartData = {
            id_user: userId,
            id_product: productData.id_product,
            purchaseQuantity: productData.purchaseQuantity || 1
        };

        const response = await fetch(`${API_URL}/api/carts/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartData)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
},

  // Cập nhật sản phẩm
  updateCart: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/api/carts/edit/${id}`, {
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
  deleteCart: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/carts/delete/${id}`, {
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
  getCartById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/carts/getbyid/${id}`);
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