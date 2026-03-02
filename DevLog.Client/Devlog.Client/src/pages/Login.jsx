import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice.js";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate("/posts");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Gradient Border Wrapper */}
        <div className="p-1px rounded-2xl bg-linear-to-r from-emerald-400/40 to-indigo-500/40">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-10 border border-zinc-800 shadow-2xl shadow-black/50">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-blue-400">
              Welcome Back
            </h2>

            <p className="text-zinc-400 mb-8 text-sm">
              Access your developer workspace
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                  placeholder="dev@workspace.io"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-emerald-400 to-indigo-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                {error.message}
              </div>
            )}

            {/* Footer */}
            <p className="mt-8 text-sm text-zinc-500 text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
