import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

const initialState = {
  profile: {},
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "profile/get",
  async (profileId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/profiles/${profileId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  },
);
export const editProfile = createAsyncThunk(
  "profile/edit",
  async ({ userId, profile }, thunkAPI) => {},
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;
