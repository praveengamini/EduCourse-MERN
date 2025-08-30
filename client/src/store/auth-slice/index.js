import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define the base URL from environment variables
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isPasswordChanging: false,
  passwordChangeError: null,
  passwordChangeSuccess: false,

};

// =======================================================
// NEW: Asynchronous Thunk for updating user profile
// =======================================================
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ id, updatePayload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/student?id=${id}`,
        updatePayload,
        { withCredentials: true }
      );
      // The backend should return the full, updated user object
      return response.data;
    } catch (error) {
      // Use rejectWithValue to pass the error message to the component
      return rejectWithValue(error.response?.data);
    }
  }
);
// =======================================================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData) => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    });
    return response.data;
  }
);

export const checkAuth1 = createAsyncThunk(
  "auth/checkauth",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // This is a direct reducer for setting user, good for initial hydration or local updates.
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Auth Check
      .addCase(checkAuth1.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth1.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth1.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;