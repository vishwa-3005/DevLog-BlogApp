import { createPost, publishPost } from "../features/posts/postSlice";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm.jsx";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIXED
  const { thumbnailUrl } = useSelector((state) => state.ai);

  // ✅ FIXED (ONLY builds data)
  const buildFormData = (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Description", data.description);
    formData.append("Content", data.content);

    // manual upload
    if (data.thumbnail?.[0]) {
      formData.append("Thumbnail", data.thumbnail[0]);
    }

    // AI thumbnail
    if (thumbnailUrl) {
      formData.append("ThumbnailUrl", thumbnailUrl);
    }

    return formData; // ✅ IMPORTANT
  };

  const handleDraft = async (data) => {
    try {
      const formData = buildFormData(data);

      const res = await dispatch(createPost(formData)).unwrap();

      navigate(`/posts/${res.id}/edit`);
    } catch (err) {
      console.error("Draft failed", err);
    }
  };

  const handlePublish = async (data) => {
    try {
      const formData = buildFormData(data);

      const res = await dispatch(createPost(formData)).unwrap();

      await dispatch(publishPost(res.id));

      navigate(`/posts/${res.id}`);
    } catch (err) {
      console.error("Publish failed", err);
    }
  };

  return (
    <PostForm
      initialData={null}
      onSubmitDraft={handleDraft}
      onSubmitPublish={handlePublish}
      loading={false}
    />
  );
}

export default CreatePost;
