import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import postsReducer from "../features/posts/postSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});
export default store;
