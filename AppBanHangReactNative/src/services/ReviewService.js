import { API_URL } from './URL_API';

export const reviewService = {
    addReview: async (reviewData) => {
        try {
            const response = await fetch(`${API_URL}/api/reviews/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });

            const data = await response.json();
            console.log('Review service response:', data);

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || 'Error adding review');
            }
        } catch (error) {
            console.error('Review service error:', error);
            return {
                status: 400,
                message: error.message
            };
        }
    },

    getUserReviews: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/reviews/user/${userId}`);

            if (!response.ok) {
                console.error('Server error:', response.status);
                return {
                    status: response.status,
                    message: `Server error: ${response.status}`
                };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            return {
                status: 500,
                message: error.message || 'Unknown error'
            };
        }
    }
};