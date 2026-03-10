import { useState, useEffect } from "react";
import { refreshToken } from "./features/auth/authSlice.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AllPosts from "./pages/AllPosts.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import NotFound from "./pages/NotFound.jsx";
import SinglePost from "./pages/SinglePost.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";

import { useDispatch } from "react-redux";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(refreshToken()).unwrap();
      } catch {
        // silent (user not logged in is fine)
      } finally {
        setAuthChecked(true); // ✅ FIXED (your version was wrong)
      }
    };

    initAuth();
  }, [dispatch]);

  if (!authChecked)
    return (
      <div className="h-screen flex items-center justify-center text-zinc-400">
        Loading...
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/posts" element={<AllPosts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/settings/:id" element={<ProfileSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
