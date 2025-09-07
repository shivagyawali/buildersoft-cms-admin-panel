import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import projectReducer from "./projectSlice";
import userReducer from "./userSlice";
import taskReducer from "./taskSlice";
import worklogReducer from "./workLogSlice";
import eventsReducer from "./eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    worklogs: worklogReducer,
    users: userReducer,
    events: eventsReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
