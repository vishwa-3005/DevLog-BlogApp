import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import postsReducer from "../features/posts/postSlice.js";
import commentReducer from "../features/comments/commentsSlice.js";
import profileReducer from "../features/profile/profileSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentReducer,
    profile: profileReducer,
  },
});
export default store;
