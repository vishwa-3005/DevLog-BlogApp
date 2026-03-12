import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  archivePost,
  getPostById,
  toggleLike,
} from "../features/posts/postSlice.js";
import NotFound from "./NotFound.jsx";
import CommentSection from "../components/CommentSection.jsx";
import Prism from "prismjs";
import { toast } from "react-toastify";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";

function SinglePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentPost, loading, error } = useSelector((state) => state.posts);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  /* ================= HIGHLIGHT ================= */
  useEffect(() => {
    if (currentPost) Prism.highlightAll();
  }, [currentPost]);

  /* ================= LIKE ================= */
  const reactionHandler = async () => {
    try {
      await dispatch(toggleLike(currentPost.id)).unwrap();
    } catch {
      toast.error("Failed to update reaction");
    }
  };

  /* ================= DELETE ================= */
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await dispatch(archivePost(id)).unwrap();
      toast.success("Post deleted successfully");
      navigate("/posts");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  /* ================= STATES ================= */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading article...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || "Something went wrong"}
      </div>
    );

  if (!currentPost) return <NotFound />;

  const isOwner =
    user && String(currentPost.authorId) === String(user.id || user.userId);

  return (
    <div className="space-y-12">
      {/* ================= HERO ================= */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          {currentPost.title}
        </h1>

        <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
          <button
            onClick={() => navigate(`/profile/${currentPost.authorId}`)}
            className="text-zinc-300 hover:text-indigo-400 transition font-medium"
          >
            {currentPost.authorName}
          </button>

          <span>•</span>

          <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= THUMBNAIL ================= */}
      {currentPost.thumbnailUrl && (
        <div className="rounded-xl overflow-hidden border border-zinc-800 max-w-4xl mx-auto">
          <img
            src={currentPost.thumbnailUrl}
            alt="Thumbnail"
            className="w-full object-cover max-h-[460px]"
          />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="max-w-3xl mx-auto">
        <div
          className="
            prose prose-invert prose-lg max-w-none

            prose-headings:text-white
            prose-h1:font-bold
            prose-h2:font-semibold
            prose-h3:font-semibold

            prose-pre:bg-zinc-900
            prose-pre:border prose-pre:border-zinc-800
            prose-pre:rounded-xl
            prose-pre:p-6

            prose-code:text-emerald-400
            prose-code:before:content-none
            prose-code:after:content-none

            prose-a:text-indigo-400
          "
          dangerouslySetInnerHTML={{ __html: currentPost.content }}
        />
      </div>

      {/* ================= ENGAGEMENT ================= */}
      <div className="max-w-3xl mx-auto border-t border-zinc-800 pt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={loading}
          onClick={reactionHandler}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition"
        >
          ❤️ {currentPost.likeCount}
        </button>

        {isOwner && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/posts/${currentPost.id}/edit`)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500"
            >
              Edit
            </button>

            <button
              onClick={deleteHandler}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ================= COMMENTS ================= */}
      <div className="max-w-3xl mx-auto">
        <CommentSection postId={currentPost.id} />
      </div>
    </div>
  );
}

export default SinglePost;
