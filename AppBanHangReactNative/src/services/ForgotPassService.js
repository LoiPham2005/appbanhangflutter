import { API_URL } from './URL_API';

export const forgotPassService = {
  // Send OTP
  sendOTP: async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/check/sendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/api/check/checkOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/check/reset-password/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Delete OTP
  deleteOTP: async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/check/deleteOTP/${email}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Delete OTP error:', error);
      throw error;
    }
  }
};