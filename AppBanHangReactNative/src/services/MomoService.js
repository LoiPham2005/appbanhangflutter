import { API_URL } from './URL_API';

export const momoService = {
  createPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/api/momo/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating MoMo payment:', error);
      throw error;
    }
  },

  handlePaymentSuccess: async (orderId, amount, userId) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/momo-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          userId
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error handling MoMo payment success:', error);
      throw error;
    }
  }
};