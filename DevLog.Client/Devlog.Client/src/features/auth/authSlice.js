import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance.js";
import axios from "axios";
import {
  clearAccessToken,
  setAccessToken,
} from "../../services/tokenService.js";

const initialState = {
  accessToken: null,
  user: {},
  error: null,
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post("api/auth/login", credentials);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login Failed");
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "api/auth/register",
        credentials,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login Failed");
    }
  },
);
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      console.log("refresh start");
      const res = await axiosInstance.post("/api/auth/refresh");
      console.log("refresh success", res.data);
      return res.data;
    } catch (error) {
      console.log("refresh failed", err.response?.status);
      return thunkAPI.rejectWithValue(null);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.accessToken = null;
      clearAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.loading = false;
        console.log("Setting token:", action.payload.accessToken);
        console.log(action.payload.user);
        setAccessToken(action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.accessToken = null;
        state.loading = false;
        clearAccessToken();
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user; //  restore identity
        state.loading = false;
        state.error = null;

        setAccessToken(action.payload.accessToken);
      })

      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        state.user = {}; // clear user
        state.loading = false;
        state.error = null;

        clearAccessToken(); // better than setAccessToken(null)
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(signUp.pending, (state, action) => {
        state.pending = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
