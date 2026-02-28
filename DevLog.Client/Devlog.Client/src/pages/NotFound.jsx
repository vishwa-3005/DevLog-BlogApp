import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="text-center max-w-xl">
        {/* Gradient Border */}
        <div className="p-px rounded-2xl bg-linear-to-r from-indigo-500/30 to-emerald-400/30">
          <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-800 shadow-2xl shadow-black/50">
            <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>

            <h2 className="text-xl font-semibold text-zinc-300 mb-3">
              Page Not Found
            </h2>

            <p className="text-zinc-400 text-sm mb-8">
              The page you’re looking for doesn’t exist or may have been moved.
            </p>

            <Link
              to="/"
              className="inline-block bg-linear-to-r from-indigo-500 to-emerald-400 text-black font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
