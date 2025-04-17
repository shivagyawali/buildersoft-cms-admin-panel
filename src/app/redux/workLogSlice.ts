import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@app/utils/axiosInstance";

const API_URL = `/worklogs`;

// ✅ Types
export interface WorkLog {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface WorkLogState {
  worklogs: WorkLog[];
  worklog: WorkLog | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkLogState = {
  worklogs: [],
  worklog: null,
  loading: false,
  error: null,
};

// 🟢 GET all worklogs
export const getWorkLogs = createAsyncThunk(
  "worklogs/fetch",
  async (page: number = 1) => {
    const response = await axiosInstance.get(`${API_URL}/list?page=${page}`);
    return response.data.data;
  }
);

// 🟢 GET single worklog
export const getSingleWorkLog = createAsyncThunk<WorkLog, string>(
  "worklogSingle/fetch",
  async (id:any) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);    
    return response.data.data;
  }
);

// 🟢 CREATE a worklog
export const createWorkLog = createAsyncThunk<WorkLog, Partial<WorkLog>>(
  "worklogs/create",
  async (worklogData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/create`,
        worklogData
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🟡 UPDATE a worklog
export const updateWorkLog = createAsyncThunk<
  WorkLog,
  { id: string; data: Partial<WorkLog> }
>("worklogs/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔴 DELETE a worklog
export const deleteWorkLog = createAsyncThunk<string, string>(
  "worklogs/delete",
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
const worklogSlice = createSlice({
  name: "worklogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET all
      .addCase(getWorkLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.worklogs = action.payload;
      })
      .addCase(getWorkLogs.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET single
      .addCase(getSingleWorkLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleWorkLog.fulfilled, (state, action) => {
        state.loading = false;
        state.worklog = action.payload;   
      })
      .addCase(getSingleWorkLog.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(
        createWorkLog.fulfilled,
        (state, action: PayloadAction<WorkLog>) => {
          state.worklogs.push(action.payload);
        }
      )

      // UPDATE
      .addCase(
        updateWorkLog.fulfilled,
        (state, action: PayloadAction<WorkLog>) => {
          const index = state.worklogs.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.worklogs[index] = action.payload;
          }
        }
      )

      // DELETE
      .addCase(
        deleteWorkLog.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.worklogs = state.worklogs.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default worklogSlice.reducer;
