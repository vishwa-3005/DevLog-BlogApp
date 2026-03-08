import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../features/comments/commentsSlice";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { comments, loading, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= Fetch ================= */
  useEffect(() => {
    if (postId) dispatch(getAllComments(postId));
  }, [dispatch, postId]);

  /* ================= Helpers ================= */

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  /* ================= Create ================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(createComment({ postId, content: commentText }));
    setCommentText("");
  };

  /* ================= Edit ================= */

  const handleEdit = (comment) => {
    setEditingId(comment.commentId);
    setEditText(comment.content);
  };

  const handleUpdate = () => {
    if (!editText.trim()) return;

    dispatch(
      editComment({
        postId,
        commentId: editingId,
        content: editText,
      }),
    );

    setEditingId(null);
    setEditText("");
  };

  /* ================= Delete ================= */

  const handleDelete = (commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  /* ================= UI ================= */

  return (
    <div className="mt-20 border-t border-zinc-800 pt-14">
      <h2 className="text-2xl font-semibold mb-10 text-white">Discussion</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="mb-14">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows="4"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            resize-none text-gray-200"
          />

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 
              rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </form>

      {error && <p className="text-red-400 mb-8">{error}</p>}

      {/* ================= COMMENTS ================= */}

      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isOwner = user?.id === comment.authorId;
            const isEdited =
              comment.updatedAt && comment.updatedAt !== comment.createdAt;

            return (
              <div
                key={comment.commentId}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition"
              >
                {/* ===== HEADER ===== */}
                <div className="flex justify-between items-start mb-4">
                  {/* Avatar + Name (Clickable) */}
                  <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => {
                      if (editingId !== comment.commentId) {
                        navigate(`/profile/${comment.authorId}`);
                      }
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700">
                      {comment.authorProfile ? (
                        <img
                          src={comment.authorProfile}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-400 font-medium">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Name + Date */}
                    <div>
                      <p className="font-medium text-gray-200 group-hover:text-indigo-400 transition">
                        {comment.authorName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                        {isEdited && (
                          <span className="ml-2 italic text-gray-500">
                            (edited)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {isOwner && editingId !== comment.commentId && (
                    <div className="flex gap-4 text-sm">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-indigo-400 hover:text-indigo-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.commentId)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* ===== CONTENT ===== */}

                {editingId === comment.commentId ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="3"
                      className="w-full bg-zinc-800 border border-zinc-700 
                      rounded-lg p-3 focus:outline-none 
                      focus:ring-2 focus:ring-indigo-500 
                      resize-none text-gray-200"
                    />

                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-md"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="text-gray-500">
            No comments yet. Be the first to start the discussion.
          </p>
        )
      )}
    </div>
  );
};

export default CommentSection;
