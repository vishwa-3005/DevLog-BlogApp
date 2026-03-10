import { createPost, publishPost } from "../features/posts/postSlice";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm.jsx";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { thumbnailUrl } = useSelector((state) => state.ai);

  const buildFormData = (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Description", data.description);
    formData.append("Content", data.content);

    if (Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach((tag) => formData.append("Tags", tag));
    }

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
      const res = await dispatch(createPost(buildFormData(data))).unwrap();
      navigate(`/posts/${res.id}/edit`);
    } catch (err) {
      console.error("Draft failed", err);
    }
  };

  const handlePublish = async (data) => {
    try {
      const res = await dispatch(createPost(buildFormData(data))).unwrap();
      await dispatch(publishPost(res.id)).unwrap();
      navigate(`/posts/${res.id}`);
    } catch (err) {
      console.error("Publish failed", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create New Post
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Write, edit, and publish your article.
        </p>
      </div>

      {/* FORM */}
      <PostForm
        initialData={null}
        onSubmitDraft={handleDraft}
        onSubmitPublish={handlePublish}
        loading={false}
      />
    </div>
  );
}

export default CreatePost;
