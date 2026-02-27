import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import reducer from "../auth/authSlice";
const initialState = {
  posts: [],
  loading: true,
  error: null,
};

export const fetchPosts = createAsyncThunk("api/posts", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("api/posts");
    console.log("posts fetched");
    return response.data;
  } catch (error) {
    console.log(error.message);
    return thunkAPI.rejectWithValue(
      error?.message || "Failed to fetch posts !",
    );
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
