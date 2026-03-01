import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postSlice";
import { Link } from "react-router-dom";

function AllPosts() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div>
      {/* Heading */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Explore DevLogs</h1>
        <p className="text-zinc-400 mt-3">
          Discover technical insights from developers.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-zinc-400 animate-pulse">Loading posts...</div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && posts?.length === 0 && (
        <div className="text-zinc-500">No posts available yet.</div>
      )}

      {/* Grid */}
      {!loading && !error && posts?.length > 0 && (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.postId}
              to={`/posts/${post.postId}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/70 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40"
            >
              {/* Thumbnail */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.thumbnail || "/fallback.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                {/* Top Content */}
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-emerald-400 transition">
                    {post.title}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-3 line-clamp-3 min-h-[60px]">
                    {post.description}
                  </p>
                </div>

                {/* Bottom Meta */}
                <div className="flex items-center justify-between mt-auto pt-6 text-xs text-zinc-500">
                  <div>
                    <span className="text-zinc-300">{post.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 flex items-center gap-1 transition group-hover:border-emerald-500/40">
                    <span>❤️</span>
                    <span>{post.likeCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPosts;
