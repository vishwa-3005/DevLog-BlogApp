import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import reducer from "../auth/authSlice";

const initialState = {
  posts: [],
  currentPost: null,
  loading: true,
  error: null,
};

//view all posts
export const fetchPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/posts");
      console.log("posts fetched");
      return response.data;
    } catch (error) {
      console.log(error.message);
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to fetch posts !",
      );
    }
  },
);

//create post
export const createPost = createAsyncThunk(
  "posts/create",
  async (formdata, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/posts", formdata);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to create post",
      );
    }
  },
);
//update publish
export const publishPost = createAsyncThunk(
  "posts/publish",
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        `/api/posts/${postId}/publish`,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to publish post!",
      );
    }
  },
);
//post update
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to publish post!",
      );
    }
  },
);
//post delete
export const archivePost = createAsyncThunk(
  "posts/archive",
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.message || "Failed to Delete post!",
      );
    }
  },
);
//post view
export const getPostById = createAsyncThunk(
  "posts/view",
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || "Failed to View post!");
    }
  },
);
//upload image
export const uploadImage = createAsyncThunk(
  "image/upload",
  async (formdata, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/uploads", formdata);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || "upload failed!");
    }
  },
);

//like post
export const toggleLike = createAsyncThunk(
  "posts/like",
  async (postId, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/reactions/${postId}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.message || "request failed");
    }
  },
);
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
      })
      .addCase(createPost.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getPostById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updatePost.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, likeCount } = action.payload;
        const post = state.posts.find((p) => p.postId == id);
        if (post) {
          post.likeCount = likeCount;
        }
        if (state.currentPost && state.currentPost.id === id) {
          state.currentPost.likeCount = likeCount;
        }
        state.error = null;
        state.loading = false;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(archivePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archivePost.fulfilled, (state, action) => {
        const postId = action.payload;

        state.posts = state.posts.filter((p) => p.postId !== postId);

        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost = null;
        }

        state.loading = false;
      })
      .addCase(archivePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
