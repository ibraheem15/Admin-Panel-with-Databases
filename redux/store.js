import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import Tour from "./features/Tour";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: Tour,
  },
});

export default store;
