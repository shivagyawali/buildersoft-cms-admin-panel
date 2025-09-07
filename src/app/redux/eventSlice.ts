import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@app/utils/axiosInstance";

const API_URL = `/events`;

// ✅ Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "INPROGRESS" | "COMPLETED";
  color: string;
  type: "PROJECT" | "TASK";
  companyId: string;
  projectId?: string;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

// 🟢 GET all events
export const getEvents = createAsyncThunk(
  "events/fetch",
  async (page: number = 1, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/list?page=${page}`);
      // response.data.data.results contains array of events
      return response.data.data.results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🧠 Slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET all
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
