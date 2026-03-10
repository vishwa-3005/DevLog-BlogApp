import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="relative text-2xl font-bold tracking-tight group"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            DevLog
          </span>

          {/* Glow effect */}
          <span className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition bg-gradient-to-r from-emerald-400 to-indigo-500"></span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/posts"
            className="relative text-sm font-medium text-zinc-400 hover:text-white transition group"
          >
            Posts
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
          </Link>

          {accessToken ? (
            <>
              <Link
                to="/posts/create"
                className="relative text-sm font-medium text-zinc-400 hover:text-white transition group"
              >
                Create
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
              </Link>

              {/* Avatar */}
              <div className="relative">
                <img
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="profile"
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer border border-zinc-700 hover:border-indigo-500 transition"
                />

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
                      onClick={() => setOpen(false)}
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        dispatch(logout());
                        setOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
