import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@app/utils/axiosInstance"; 
const API_URL = `/projects`; 

// ✅ Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

// 🟢 GET all projects
export const getProjects = createAsyncThunk(
  "projects/fetch",
  async (page: number = 1) => {
    const response = await axiosInstance.get(`${API_URL}/list?page=${page}`);
    return response.data.data; // assuming this is the 'data' object from your response
  }
);

// 🟢 CREATE a project
export const createProject = createAsyncThunk<Project, Partial<Project>>(
  "projects/create",
  async (projectData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/create`,
        projectData
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🟡 UPDATE a project
export const updateProject = createAsyncThunk<
  Project,
  { id: string; data: Partial<Project> }
>("projects/update", async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔴 DELETE a project
export const deleteProject = createAsyncThunk<string, string>(
  "projects/delete",
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
const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProjects.fulfilled,
        (state, action) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(getProjects.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.projects.push(action.payload);
        }
      )

      // UPDATE
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          const index = state.projects.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.projects[index] = action.payload;
          }
        }
      )

      // DELETE
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.projects = state.projects.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default projectSlice.reducer;
