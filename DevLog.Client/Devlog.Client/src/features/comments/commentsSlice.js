import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

/* ================= CREATE ================= */
export const createComment = createAsyncThunk(
  "comments/create",
  async ({ postId, content }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/api/posts/${postId}/comments`,
        { content },
      );

      return response.data; // returns full comment object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create comment failed",
      );
    }
  },
);

/* ================= EDIT ================= */
export const editComment = createAsyncThunk(
  "comments/edit",
  async ({ postId, commentId, content }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/api/posts/${postId}/comments/${commentId}`,
        { content },
      );

      return response.data; // { id, content }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Edit comment failed",
      );
    }
  },
);

/* ================= DELETE ================= */
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/posts/${postId}/comments/${commentId}`);

      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete comment failed",
      );
    }
  },
);

/* ================= FETCH ================= */
export const getAllComments = createAsyncThunk(
  "comments/fetchByPost",
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}/comments`);

      return response.data; // array of comments
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch comments failed",
      );
    }
  },
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== CREATE ===== */
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== EDIT ===== */
      .addCase(editComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updated = action.payload;

        const index = state.comments.findIndex(
          (c) => c.commentId === updated.id,
        );

        if (index !== -1) {
          state.comments[index].content = updated.content;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== DELETE ===== */
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.comments = state.comments.filter(
          (c) => c.commentId !== action.payload,
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH ===== */
      .addCase(getAllComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments = action.payload;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
