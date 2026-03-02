import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../features/comments/commentsSlice";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);

  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= Fetch Comments ================= */
  useEffect(() => {
    if (postId) {
      dispatch(getAllComments(postId));
    }
  }, [dispatch, postId]);

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

  return (
    <div className="mt-16 border-t border-zinc-800 pt-12">
      <h2 className="text-2xl font-semibold mb-10">Discussion</h2>

      {/* ================= Comment Form ================= */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            resize-none text-gray-200"
            rows="4"
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

      {error && <p className="text-red-500 mb-8">{error}</p>}

      {/* ================= Comment List ================= */}
      {comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map((comment) => {
            const isEdited =
              comment.updatedAt && comment.updatedAt !== comment.createdAt;

            return (
              <div
                key={comment.commentId}
                className="bg-zinc-900 border border-zinc-800 
                rounded-xl p-6 transition hover:border-zinc-700"
              >
                {/* ===== Top Section ===== */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
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

                    {/* Author + Date */}
                    <div>
                      <p className="font-medium text-gray-200">
                        {comment.authorName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {isEdited && (
                          <span className="ml-2 italic text-gray-500">
                            (edited)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {editingId !== comment.commentId && (
                    <div className="flex gap-5 text-sm">
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

                {/* ===== Content / Edit Mode ===== */}
                {editingId === comment.commentId ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 
                      rounded-lg p-3 focus:outline-none 
                      focus:ring-2 focus:ring-indigo-500 
                      resize-none text-gray-200"
                      rows="3"
                    />

                    <div className="flex gap-4 mt-5">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-1 bg-indigo-600 
                        hover:bg-indigo-500 rounded-md transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1 bg-zinc-700 
                        hover:bg-zinc-600 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300 leading-relaxed">
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
