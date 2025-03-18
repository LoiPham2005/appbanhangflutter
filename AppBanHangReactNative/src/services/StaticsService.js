import { API_URL } from './URL_API';

export const statisticsService = {
    getDailyReport: async (startDate, endDate) => {
        try {
            const formattedStartDate = new Date(startDate).toISOString();
            const formattedEndDate = new Date(endDate).toISOString();
            
            const response = await fetch(
                `${API_URL}/api/statistics/daily?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
            );
            
            const data = await response.json();
            
            if (response.ok && data.status === 200) {
                return {
                    success: true,
                    data: data.data
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'Error fetching statistics'
                };
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
            return {
                success: false,
                message: error.message
            };
        }
    }
};