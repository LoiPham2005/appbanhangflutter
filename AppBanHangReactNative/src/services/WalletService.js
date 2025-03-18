import { API_URL } from './URL_API';

export const walletService = {
  // Lấy danh sách ví
  getWallet: async () => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/list`);
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
      console.error("Error fetching wallet:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Thêm ví mới
  addWallet: async (walletData) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding wallet:", error);
      throw error;
    }
  },

  // Cập nhật ví
  updateWallet: async (userId, transactionData) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/edit/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: {
            transactionId: transactionData.transactionId,
            type: transactionData.type,
            amount: transactionData.amount,
            description: transactionData.description
          }
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating wallet:", error);
      throw error;
    }
  }
};