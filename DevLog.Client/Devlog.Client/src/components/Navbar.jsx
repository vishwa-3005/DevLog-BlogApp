import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  console.log(
    "Auth state:",
    useSelector((state) => state.auth),
  );

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight bg-linear-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent"
        >
          DevLog
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/posts"
            className="text-zinc-400 hover:text-white transition"
          >
            Posts
          </Link>

          {accessToken ? (
            <>
              <Link
                to="/posts/create"
                className="text-zinc-400 hover:text-white transition"
              >
                Create
              </Link>

              {/* Profile Avatar */}
              <div className="relative">
                <img
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="profile"
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer border border-zinc-700"
                />

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg">
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
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
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
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
                className="text-zinc-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
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
