import { createPost, publishPost } from "../features/posts/postSlice";
import { useDispatch, useSelector } from "react-redux";
import PostForm from "../components/PostForm.jsx";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { thumbnailUrl } = useSelector((state) => state.ai);

  //  FIXED FORM DATA BUILDER (FINAL)
  const buildFormData = (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Description", data.description);
    formData.append("Content", data.content);

    // TAGS FIX (MOST IMPORTANT)
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach((tag) => {
        formData.append("Tags", tag); // MUST MATCH DTO NAME
      });
    }

    // manual upload
    if (data.thumbnail?.[0]) {
      formData.append("Thumbnail", data.thumbnail[0]);
    }

    // AI thumbnail
    if (thumbnailUrl) {
      formData.append("ThumbnailUrl", thumbnailUrl);
    }

    return formData;
  };

  // SAVE DRAFT
  const handleDraft = async (data) => {
    try {
      const formData = buildFormData(data);

      const res = await dispatch(createPost(formData)).unwrap();

      navigate(`/posts/${res.id}/edit`);
    } catch (err) {
      console.error("Draft failed", err);
    }
  };

  // PUBLISH
  const handlePublish = async (data) => {
    try {
      const formData = buildFormData(data);

      const res = await dispatch(createPost(formData)).unwrap();

      await dispatch(publishPost(res.id)).unwrap();

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
