import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@app/utils/axiosInstance";

const API_URL = `/users`;

// 🔰 Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  company?: { name: string };
  hourlyRate?: number;
}

export interface UserFilterParams {
  name?: string;
  email?: string;
}

interface UsersResponse {
  results: User[];
  totalPages: number;
}

interface UserState {
  users: UsersResponse | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: null,
  user: null,
  loading: false,
  error: null,
};

// 🟢 GET all users 
export const getUsers = createAsyncThunk<UsersResponse, { page?: number; filters?: UserFilterParams }>(
  "users/fetch",
  async ({ page = 1, filters } = {}) => {
    let url = `${API_URL}/list?page=${page}`;
    
    if (filters) {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.email) queryParams.append("email", filters.email);
      
      url = `${API_URL}/list?${queryParams.toString()}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data.data;
  }
);

// 🟢 GET single user
export const getSingleUser = createAsyncThunk<User, string>(
  "userSingle/fetch",
  async (id) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data.data;
  }
);

// 🟢 CREATE a user
export const createUser = createAsyncThunk<User, Partial<User>>(
  "users/create",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/create`, userData);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🟡 UPDATE a user
export const updateUser = createAsyncThunk<
  User,
  { id: string; data: Partial<User> }
>("users/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔴 DELETE a user
export const deleteUser = createAsyncThunk<string, string>(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🧠 Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 GET all users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<UsersResponse>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(getUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔎 GET single user
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSingleUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(getSingleUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE user
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        if (state.users?.results) {
          state.users.results.push(action.payload);
        }
      })

      // ✏️ UPDATE user
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        if (state.users?.results) {
          const index = state.users.results.findIndex(
            (u) => u.id === action.payload.id
          );
          if (index !== -1) {
            state.users.results[index] = action.payload;
          }
        }
      })

      // ❌ DELETE user
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.users?.results) {
          state.users.results = state.users.results.filter(
            (u) => u.id !== action.payload
          );
        }
      });
  },
});

export default userSlice.reducer;
