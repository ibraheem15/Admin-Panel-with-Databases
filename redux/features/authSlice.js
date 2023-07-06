import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  email: null,
  password: null,
  mobile: null,
};

export const auth = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logOut: (state) => {
      state.id = null;
      state.username = null;
      state.email = null;
      state.password = null;
      state.mobile = null;
    },
    logIn: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        password: action.payload.password,
        mobile: action.payload.mobile,
      };
    },
    updateUser: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        password: action.payload.password,
        mobile: action.payload.mobile,
      };
    },
  },
});

export const { logOut, logIn,updateUser } = auth.actions;

// export const selectAuth = (state) => state.auth;

export default auth.reducer;
