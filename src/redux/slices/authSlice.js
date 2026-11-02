
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
      const { accessToken, refreshToken, user } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthChecked = true;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;

      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      } else {
        localStorage.removeItem("accessToken");
      }
    },

    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthChecked = true;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
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
