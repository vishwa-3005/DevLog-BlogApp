import React from "react";
import { useNavigate } from "react-router-dom";
function PostGrid({ posts }) {
  const navigate = useNavigate();
  if (!posts.length) {
    return (
      <div className="text-center text-gray-500 mt-10">No posts here yet.</div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {posts.map((post) => (
        <div
          onClick={() => {
            navigate(`/posts/${post.postId}`);
          }}
          key={post.postId}
          className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition"
        >
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-400 mt-2 line-clamp-3">
            {post.description}
          </p>
          <p className="text-xs text-gray-500 mt-4">
            {new Date(post.UpdatedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PostGrid;
