import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL for API
const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/adminStudent`;

// Async thunk for adding student by admin
export const addStudentByAdmin = createAsyncThunk(
  'adminStudent/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Network error occurred',
      });
    }
  }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  'adminStudent/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Network error occurred',
      });
    }
  }
);

// Initial state
const initialState = {
  // Add student states
  addStudent: {
    loading: false,
    success: false,
    error: null,
    data: null,
    generatedPassword: null,
  },
  
  // Change password states
  changePassword: {
    loading: false,
    success: false,
    error: null,
  },
  
  // General UI states
  message: null,
};

// Admin Student slice
const adminStudentSlice = createSlice({
  name: 'adminStudent',
  initialState,
  reducers: {
    // Clear add student state
    clearAddStudentState: (state) => {
      state.addStudent = {
        loading: false,
        success: false,
        error: null,
        data: null,
        generatedPassword: null,
      };
      state.message = null;
    },
    
    // Clear change password state
    clearChangePasswordState: (state) => {
      state.changePassword = {
        loading: false,
        success: false,
        error: null,
      };
      state.message = null;
    },
    
    // Clear all states
    clearAllStates: (state) => {
      return initialState;
    },
    
    // Clear message
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Add Student by Admin
    builder
      .addCase(addStudentByAdmin.pending, (state) => {
        state.addStudent.loading = true;
        state.addStudent.success = false;
        state.addStudent.error = null;
        state.message = null;
      })
      .addCase(addStudentByAdmin.fulfilled, (state, action) => {
        state.addStudent.loading = false;
        state.addStudent.success = true;
        state.addStudent.error = null;
        state.addStudent.data = action.payload.data;
        state.addStudent.generatedPassword = action.payload.generatedPassword;
        state.message = action.payload.message;
      })
      .addCase(addStudentByAdmin.rejected, (state, action) => {
        state.addStudent.loading = false;
        state.addStudent.success = false;
        state.addStudent.error = action.payload?.message || 'Failed to add student';
        state.message = action.payload?.message || 'Failed to add student';
      })

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.changePassword.loading = true;
        state.changePassword.success = false;
        state.changePassword.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.changePassword.loading = false;
        state.changePassword.success = true;
        state.changePassword.error = null;
        state.message = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword.loading = false;
        state.changePassword.success = false;
        state.changePassword.error = action.payload?.message || 'Failed to change password';
        state.message = action.payload?.message || 'Failed to change password';
      });
  },
});

// Export actions
export const {
  clearAddStudentState,
  clearChangePasswordState,
  clearAllStates,
  clearMessage,
} = adminStudentSlice.actions;

// Export selectors
export const selectAddStudent = (state) => state.adminStudent.addStudent;
export const selectChangePassword = (state) => state.adminStudent.changePassword;
export const selectMessage = (state) => state.adminStudent.message;

// Export reducer
export default adminStudentSlice.reducer;