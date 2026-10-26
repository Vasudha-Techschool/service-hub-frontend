
import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: getStoredUser(),
  isAuthChecked: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthChecked = true;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthChecked = true;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setAuthChecked,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
