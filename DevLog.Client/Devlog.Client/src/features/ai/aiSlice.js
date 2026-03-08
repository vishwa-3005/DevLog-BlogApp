import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

const initialState = {
  thumbnailUrl: null,
  requesting: false,
  error: null,
};

export const generateThumbnail = createAsyncThunk(
  "ai/generateThumbnail",
  async (content, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/thumbnails", {
        content,
      });

      return response.data.thumbnailUrl;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "AI request failed",
      );
    }
  },
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    resetAI: (state) => {
      state.thumbnailUrl = null;
      state.requesting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateThumbnail.pending, (state) => {
        state.requesting = true;
        state.error = null;
      })
      .addCase(generateThumbnail.fulfilled, (state, action) => {
        state.requesting = false;
        state.thumbnailUrl = action.payload;
      })
      .addCase(generateThumbnail.rejected, (state, action) => {
        state.requesting = false;
        state.error = action.payload;
      });
  },
});

export const { resetAI } = aiSlice.actions;
export default aiSlice.reducer;
