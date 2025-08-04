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

      const response = await fetch(`${API_BASE_URL}/adminStudent?${queryParams}`, {
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
      const response = await fetch(`${API_BASE_URL}/adminStudent/${studentId}`, {
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
  },

  // Unenroll student from a course
  unenrollStudentFromCourse: async (studentId, courseId) => {
    try {
      console.log('API call - Unenrolling:', studentId, courseId);
      const response = await fetch(`${API_BASE_URL}/adminStudent/${studentId}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error unenrolling student:', error);
      throw error;
    }
  }
};


// Helper function to get auth token (implement based on your auth system)
const getAuthToken = () => {
  // Return the auth token from localStorage, sessionStorage, or your auth context
  return localStorage.getItem('authToken');
};