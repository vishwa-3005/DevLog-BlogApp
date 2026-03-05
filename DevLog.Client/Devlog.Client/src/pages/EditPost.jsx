import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  updatePost,
  publishPost,
} from "../features/posts/postSlice.js";
import PostForm from "../components/PostForm.jsx";
import { toast } from "react-toastify";

function EditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPost, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  const buildFormData = (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Content", data.content);
    formData.append("Description", data.description);

    if (data.thumbnail?.[0]) {
      formData.append("Thumbnail", data.thumbnail[0]);
    }

    return formData;
  };

  const handleDraft = async (data) => {
    try {
      const formData = buildFormData(data);
      await dispatch(updatePost({ id, formData })).unwrap();
      toast.success("Draft saved successfully");
      navigate(`/posts`);
    } catch (err) {
      toast.error("Failed to save draft");
    }
  };

  const handlePublish = async (data) => {
    try {
      const formData = buildFormData(data);
      const res = await dispatch(updatePost({ id, formData })).unwrap();
      await dispatch(publishPost(id));
      toast.success("Post published successfully");
      navigate(`/posts/${res.id}`);
    } catch (err) {
      toast.error("Failed to publish post");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <PostForm
        initialData={currentPost}
        onSubmitDraft={handleDraft}
        onSubmitPublish={handlePublish}
        loading={loading}
      />
    </div>
  );
}

export default EditPost;
