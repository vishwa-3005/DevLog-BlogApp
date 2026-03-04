import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostById, updatePost } from "../features/posts/postSlice.js";
import PostForm from "../components/PostForm.jsx";

function EditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPost, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Content", data.content);
    formData.append("Description", data.description);

    if (data.thumbnail?.[0]) {
      formData.append("Thumbnail", data.thumbnail[0]);
    }

    const res = await dispatch(updatePost({ id, formData })).unwrap();

    navigate(`/posts/${res.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <PostForm
        initialData={currentPost}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default EditPost;
