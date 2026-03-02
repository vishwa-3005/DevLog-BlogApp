import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPostById } from "../features/posts/postSlice.js";
import NotFound from "./NotFound.jsx";
import { toggleLike } from "../features/posts/postSlice.js";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";

function SinglePost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPost, loading, error } = useSelector((state) => state.posts);
  const [commentText, setCommentText] = useState("");
  const reactionHandler = async (postId) => {
    await dispatch(toggleLike(postId));
  };
  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPost) {
      Prism.highlightAll();
    }
  }, [currentPost]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0b1220] text-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
            {currentPost.title}
          </h1>

          <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-400">
            <span>{currentPost.authorName}</span>
            <span>•</span>
            <span>{new Date(currentPost.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {currentPost.thumbnailUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <img
              src={currentPost.thumbnailUrl}
              alt="Thumbnail"
              className="w-full object-cover max-h-[500px] transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-lg">
          <div
            className="
              prose prose-invert prose-lg max-w-none
              prose-pre:bg-zinc-900
              prose-pre:border prose-pre:border-zinc-800
              prose-pre:rounded-xl
              prose-pre:p-6
              prose-pre:overflow-x-auto
              prose-code:text-emerald-400
              prose-code:before:content-none
              prose-code:after:content-none
              prose-headings:text-white
              prose-strong:text-white
              prose-a:text-indigo-400
            "
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />
        </div>

        {/* Engagement */}
        <div className="mt-12 border-t border-gray-800 pt-8 flex justify-between items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => reactionHandler(currentPost.id)}
            className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
          >
            ❤️ {currentPost.likeCount}
          </button>

          <span className="text-gray-400 text-sm">
            {currentPost.comments?.length || 0} Comments
          </span>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Comments</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!commentText.trim()) return;
              setCommentText("");
            }}
            className="mb-8"
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="4"
            />
            <button
              type="submit"
              className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Post Comment
            </button>
          </form>

          {currentPost.comments?.length > 0 ? (
            <div className="space-y-6">
              {currentPost.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg"
                >
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{comment.authorName}</span>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
