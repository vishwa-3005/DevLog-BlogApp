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
  const { user } = useSelector((state) => state.auth);

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
      <h2 className="text-xl font-semibold mb-10 tracking-tight">Discussion</h2>

      {/* ================= Comment Form ================= */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="
              w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 
              focus:outline-none focus:border-indigo-500 
              resize-none text-zinc-200 text-sm
            "
            rows="4"
          />

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              disabled={loading}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                bg-indigo-600 hover:bg-indigo-500
                transition shadow-lg shadow-indigo-600/20
                disabled:opacity-50
              "
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </form>

      {error && <p className="text-red-400 mb-8">{error}</p>}

      {/* ================= Comment List ================= */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isAuthor = user && comment.authorId === user.id;
            const isEdited =
              comment.updatedAt && comment.updatedAt !== comment.createdAt;

            return (
              <div
                key={comment.commentId}
                className="
                  bg-zinc-900 border border-zinc-800 rounded-xl p-6
                  transition hover:border-zinc-700
                "
              >
                {/* ===== Top Section ===== */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700">
                      {comment.authorProfile ? (
                        <img
                          src={comment.authorProfile}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-zinc-400 font-medium">
                          {comment.authorName?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Author + Date */}
                    <div>
                      <p className="font-medium text-zinc-200 text-sm">
                        {comment.authorName}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {isEdited && (
                          <span className="ml-2 italic">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isAuthor && editingId !== comment.commentId && (
                    <div className="flex gap-4 text-xs">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="
                          px-3 py-1 rounded-md
                          bg-zinc-800 hover:bg-zinc-700
                          transition text-zinc-300
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(comment.commentId)}
                        className="
                          px-3 py-1 rounded-md
                          bg-red-600/90 hover:bg-red-600
                          transition text-white
                        "
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* ===== Content / Edit Mode ===== */}
                {isAuthor && editingId === comment.commentId ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="
                        w-full bg-zinc-950 border border-zinc-800 
                        rounded-lg p-3 focus:outline-none 
                        focus:border-indigo-500 
                        resize-none text-zinc-200 text-sm
                      "
                      rows="3"
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleUpdate}
                        className="
                          px-4 py-1.5 rounded-md text-sm font-medium
                          bg-indigo-600 hover:bg-indigo-500
                          transition
                        "
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="
                          px-4 py-1.5 rounded-md text-sm font-medium
                          bg-zinc-700 hover:bg-zinc-600
                          transition
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="text-zinc-500 text-sm text-center">
            No comments yet. Be the first to start the discussion.
          </p>
        )
      )}
    </div>
  );
};

export default CommentSection;
