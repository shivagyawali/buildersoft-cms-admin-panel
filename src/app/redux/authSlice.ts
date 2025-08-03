import { defaultConfig } from "@app/config/defaultConfig";
import axiosInstance from "@app/utils/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
interface Company {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  logo: string | null;
  role: string;
}

interface Permissions {
  projects: string[];
  companies: string[];
  tasks: string[];
  users: string[];
  worklogs: string[];
}

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  company: Company;
  companyId: string;
  permissions: Permissions;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk to check if user is authenticated
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (): Promise<{ user: any | null; isAuthenticated: boolean }> => {
    try {
      const response = await axiosInstance.get(
        `${defaultConfig.baseUrl}/users/profile`
      );
      const isAuthenticated = response.data.statusCode === 200;
      return {
        user: response.data.data ?? null,
        isAuthenticated,
      };
    } catch {
      localStorage.removeItem("token");
      return {
        user: null,
        isAuthenticated: false,
      };
    }
  }
);
// Async action for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${defaultConfig.baseUrl}/auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data; // Expecting { user, token }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = true;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          localStorage.setItem("token", action.payload.token);

        }
      )
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkAuthStatus.fulfilled,
        (
          state,
          action: PayloadAction<{ user: any | null; isAuthenticated: boolean }>
        ) => {
          state.user = action.payload.user;
          state.isAuthenticated = action.payload.isAuthenticated;
          state.loading = false;
        }
      )
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
