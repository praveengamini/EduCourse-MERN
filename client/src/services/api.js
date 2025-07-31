// API Configuration
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Course API
export const courseAPI = {
  getAllCourses: async () => {
    return apiRequest('/api/admin/courses');
  },

  getCourseById: async (courseId) => {
    return apiRequest(`/courses/${courseId}`);
  },

  enrollCourse: async (courseId) => {
    return apiRequest('/courses/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },

  getEnrolledCourses: async (userId) => {
    return apiRequest(`/courses/enrolled/${userId}`);
  },

  updateProgress: async (progressData) => {
    return apiRequest('/courses/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },

  getProgress: async (userId, courseId) => {
    return apiRequest(`/courses/progress/${userId}/${courseId}`);
  },
};

// Contact API
export const contactAPI = {
  submitContactForm: async (contactData) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  getContactForms: async () => {
    return apiRequest('/contact');
  },

  markAsRead: async (contactId) => {
    return apiRequest(`/contact/${contactId}/read`, {
      method: 'PATCH',
    });
  },
};

// User API
export const userAPI = {
  getUserProfile: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  updateUserProfile: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API (for course management)
export const adminAPI = {
  createCourse: async (courseData) => {
    return apiRequest('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  updateCourse: async (courseId, courseData) => {
    return apiRequest(`/admin/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  deleteCourse: async (courseId) => {
    return apiRequest(`/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  getAllUsers: async () => {
    return apiRequest('/admin/users');
  },

  getAnalytics: async () => {
    return apiRequest('/admin/analytics');
  },
};
