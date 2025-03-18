import { API_URL } from './config';

export const orderListService = {
  // Get all orders
  getOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders/list`); // Sửa API path
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // Trả về toàn bộ response từ server
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/status/${orderId}`, { // Sửa API path
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
};