import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight bg-linear-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent"
        >
          DevLog
        </Link>

        {/* Navigation Links */}
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

              <button
                onClick={() => dispatch(logout())}
                className="border border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-500 hover:bg-zinc-800 transition"
              >
                Logout
              </button>
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
