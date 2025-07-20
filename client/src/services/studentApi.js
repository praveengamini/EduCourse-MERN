const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api`;

export const studentApi = {
  // Get all students with pagination and filtering
  getAllStudents: async ({ page = 1, limit = 15, search = '', filterBy = 'all' } = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        filterBy
      });

      const response = await fetch(`${API_BASE_URL}/students?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get student details with enrolled courses
  getStudentDetails: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  }
};

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = () => {
  // Return the auth token from localStorage, sessionStorage, or your auth context
  return localStorage.getItem('authToken');
};