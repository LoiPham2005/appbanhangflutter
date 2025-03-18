import { API_URL } from './URL_API';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders/list`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, data) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  getUserOrders: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/user/${userId}`);
      const data = await response.json();

      if (data.status === 200 && data.data) {
        const processedOrders = data.data.map(order => ({
          ...order,
          items: order.items.map(item => {
            return {
              ...item,
              id_product: item.id_product || null
            };
          })
        }));

        return {
          status: 200,
          data: processedOrders
        };
      }
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Add new method for handling returns
  returnOrder: async (orderId, returnData) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: data.status,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error("Error returning order:", error);
      throw error;
    }
  }
};