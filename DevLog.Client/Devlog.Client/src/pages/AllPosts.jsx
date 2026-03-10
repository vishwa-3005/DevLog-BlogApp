import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  fetchPostsByTags,
  fetchTags,
} from "../features/posts/postSlice";
import { Link } from "react-router-dom";
import PostCardSkeleton from "../components/PostCardSkeleton";

function AllPosts() {
  const dispatch = useDispatch();
  const { posts, tags, loading, error } = useSelector((state) => state.posts);

  const [selectedTags, setSelectedTags] = useState([]);

  //
  // ✅ INITIAL LOAD
  //
  useEffect(() => {
    dispatch(fetchTags());
    dispatch(fetchPosts());
  }, [dispatch]);

  //
  // ✅ FILTER WHEN TAGS CHANGE
  //
  useEffect(() => {
    if (selectedTags.length === 0) {
      dispatch(fetchPosts());
    } else {
      dispatch(fetchPostsByTags(selectedTags.join(",")));
    }
  }, [selectedTags, dispatch]);

  //
  // ✅ TOGGLE TAG
  //
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  //
  // ✅ CLEAR FILTER
  //
  const clearFilters = () => setSelectedTags([]);

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Explore DevLogs
        </h1>

        <p className="text-zinc-400 text-sm max-w-2xl">
          Discover technical insights, real-world solutions, and practical
          knowledge shared by developers.
        </p>
      </div>

      {/* ================= TAG FILTER ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-400">Filter by tags</h3>

          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-400 hover:text-red-300 transition"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => {
            const active = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  active
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && !error && posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-400 text-lg">No posts found</p>
          <p className="text-zinc-500 text-sm mt-2">
            Try adjusting filters or create your first post.
          </p>
        </div>
      )}

      {/* ================= GRID ================= */}
      {!loading && !error && posts?.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.postId}
              to={`/posts/${post.postId}`}
              className="group flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-indigo-500/40"
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
              <div className="flex flex-col flex-grow p-5 space-y-4">
                {/* Title + Description */}
                <div>
                  <h2 className="text-lg font-semibold leading-tight group-hover:text-indigo-400 transition">
                    {post.title}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                    {post.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorImage || "/default-avatar.png"}
                      alt="author"
                      className="w-6 h-6 rounded-full"
                    />

                    <span className="text-zinc-300">{post.authorName}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
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
