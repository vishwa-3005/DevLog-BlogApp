import React from "react";
import { useNavigate } from "react-router-dom";

function PostGrid({ posts }) {
  const navigate = useNavigate();

  if (!posts.length) {
    return (
      <div className="text-center text-zinc-500 mt-16">
        No posts available yet.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.postId}
          onClick={() => navigate(`/posts/${post.postId}`)}
          className="
            group cursor-pointer rounded-xl border border-zinc-800
            bg-zinc-900/60 backdrop-blur
            hover:border-emerald-500/40 hover:-translate-y-1
            transition duration-300 overflow-hidden
          "
        >
          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition">
              {post.title}
            </h3>

            <p className="text-sm text-zinc-400 line-clamp-3">
              {post.description}
            </p>

            <p className="text-xs text-zinc-500 pt-3">
              {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostGrid;
