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

  const { thumbnailUrl } = useSelector((state) => state.ai);
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

    if (thumbnailUrl) {
      formData.append("ThumbnailUrl", thumbnailUrl);
    }

    return formData;
  };

  const handleDraft = async (data) => {
    try {
      await dispatch(
        updatePost({ id, formData: buildFormData(data) }),
      ).unwrap();
      toast.success("Draft saved successfully");
      navigate("/posts");
    } catch {
      toast.error("Failed to save draft");
    }
  };

  const handlePublish = async (data) => {
    try {
      const res = await dispatch(
        updatePost({ id, formData: buildFormData(data) }),
      ).unwrap();
      await dispatch(publishPost(id));
      toast.success("Post published successfully");
      navigate(`/posts/${res.id}`);
    } catch {
      toast.error("Failed to publish post");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Update your content and publish when ready.
        </p>
      </div>

      {/* FORM */}
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
