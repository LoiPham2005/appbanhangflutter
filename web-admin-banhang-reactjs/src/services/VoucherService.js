import { API_URL } from './config';

export const voucherService = {
  // Get all vouchers
  getVouchers: async () => {
    try {
      const response = await fetch(`${API_URL}/voucher/list`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      throw error;
    }
  },

  // Add new voucher
  addVoucher: async (voucherData) => {
    try {
      const response = await fetch(`${API_URL}/voucher/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding voucher:", error);
      throw error;
    }
  },

  // Update voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await fetch(`${API_URL}/voucher/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating voucher:", error);
      throw error;
    }
  },

  // Delete voucher
  deleteVoucher: async (id) => {
    try {
      const response = await fetch(`${API_URL}/voucher/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw error;
    }
  }
};