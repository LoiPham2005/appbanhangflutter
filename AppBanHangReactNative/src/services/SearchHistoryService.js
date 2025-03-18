import { API_URL } from './URL_API';

export const searchHistoryService = {
    // Add search history
    addSearchHistory: async (userId, keyword) => {
        try {
            const response = await fetch(`${API_URL}/api/search-history/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, keyword })
            });
            return await response.json();
        } catch (error) {
            console.error("Error adding search history:", error);
            throw error;
        }
    },

    // Get user's search history
    getUserSearchHistory: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/search-history/user/${userId}`);
            const data = await response.json();
            if (data.status === 200) {
                return {
                    success: true,
                    data: data.data
                };
            }
            return {
                success: false,
                message: data.message
            };
        } catch (error) {
            console.error("Error getting search history:", error);
            throw error;
        }
    },

    // Delete search history
    deleteSearchHistory: async (userId, keyword) => {
        try {
            const response = await fetch(`${API_URL}/api/search-history/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, keyword })
            });
            return await response.json();
        } catch (error) {
            console.error("Error deleting search history:", error);
            throw error;
        }
    }
};