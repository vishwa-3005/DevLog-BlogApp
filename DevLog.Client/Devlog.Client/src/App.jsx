import { useState, useEffect } from "react";
import { clearAccessToken, setAccessToken } from "./services/tokenService.js";
import { refreshToken } from "./features/auth/authSlice.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useDispatch } from "react-redux";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("App mounted");
    dispatch(refreshToken()).finally(setAuthChecked(true));
  }, []);
  if (!authChecked) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/posts" element={<AllPosts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
