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

export interface FilterParams {
  name?: string;
  date?: string;
  status?: string;
}

interface ProjectState {
  projects: Project[];
  project: Project | null;
  loading: boolean;
  error: string | null;
}
export interface CreateProjectResponse {
  message: string;
  data: Project;
}

const initialState: ProjectState = {
  projects: [],
  project: null,
  loading: false,
  error: null,
};

// 🟢 GET all projects (with optional filters)
export const getProjects = createAsyncThunk(
  "projects/fetch",
  async ({ page = 1, filters }: { page?: number; filters?: FilterParams } = {}) => {
    let url = `${API_URL}/list?page=${page}`;
    
    if (filters) {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.date) queryParams.append("date", filters.date);
      if (filters.status) queryParams.append("status", filters.status);
      
      url = `${API_URL}/list?${queryParams.toString()}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data.data;
  }
);

// 🟢 GET single project
export const getSingleProject = createAsyncThunk<Project, string>(
  "projectSingle/fetch",
  async (id: any) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data.data;
  }
);

// 🟢 CREATE a project
export const createProject = createAsyncThunk<
  CreateProjectResponse,
  Partial<Project>
>("projects/create", async (projectData, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/create`, projectData);
    return response.data as CreateProjectResponse;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

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
      // GET all
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET single
      .addCase(getSingleProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getSingleProject.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<CreateProjectResponse>) => {
          state.loading = false;
          state.error = null;
          if (action.payload?.data) {
            // Ensure projects is an array
            if (!Array.isArray(state.projects)) {
              state.projects = [];
            }
            state.projects.push(action.payload.data);
          }
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
