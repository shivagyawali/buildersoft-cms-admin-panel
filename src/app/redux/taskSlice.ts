import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@app/utils/axiosInstance";

const API_URL = `/tasks`;

// ✅ Types
export interface Task {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface TaskState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
};

// 🟢 GET all tasks
export const getTasks = createAsyncThunk(
  "tasks/fetch",
  async (page: number = 1) => {
    const response = await axiosInstance.get(`${API_URL}/list?page=${page}`);
    return response.data.data;
  }
);

// 🟢 GET single task
export const getSingleTask = createAsyncThunk<Task, string>(
  "taskSingle/fetch",
  async (id:any) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);    
    return response.data.data;
  }
);

// 🟢 CREATE a task
export const createTask = createAsyncThunk<Task, Partial<Task>>(
  "tasks/create",
  async (taskData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/create`,
        taskData
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🟡 UPDATE a task
export const updateTask = createAsyncThunk<
  Task,
  { id: string; data: Partial<Task> }
>("tasks/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔴 DELETE a task
export const deleteTask = createAsyncThunk<string, string>(
  "tasks/delete",
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
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET all
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET single
      .addCase(getSingleTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;   
      })
      .addCase(getSingleTask.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(
        createTask.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.tasks.push(action.payload);
        }
      )

      // UPDATE
      .addCase(
        updateTask.fulfilled,
        (state, action: PayloadAction<Task>) => {
          const index = state.tasks.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        }
      )

      // DELETE
      .addCase(
        deleteTask.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.tasks = state.tasks.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default taskSlice.reducer;
