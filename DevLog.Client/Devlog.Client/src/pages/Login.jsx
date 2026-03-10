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
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-emerald-400/40 to-indigo-500/40">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-10 border border-zinc-800 shadow-2xl shadow-black/50">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-emerald-400">
              Welcome Back
            </h2>

            <p className="text-zinc-400 mb-8 text-sm">
              Access your developer workspace
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@workspace.io"
                className="field"
              />

              {/* Password */}
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="field"
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-400 to-indigo-500 text-black font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <div className="mt-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}

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
