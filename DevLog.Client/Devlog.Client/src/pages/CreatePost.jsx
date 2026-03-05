import { createPost, publishPost } from "../features/posts/postSlice";
import { useDispatch } from "react-redux";
import PostForm from "../components/PostForm.jsx";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    const formData = buildFormData(data);
    const res = await dispatch(createPost(formData)).unwrap();

    navigate(`/posts/${res.id}/edit`);
  };

  const handlePublish = async (data) => {
    const formData = buildFormData(data);

    const res = await dispatch(createPost(formData)).unwrap();

    await dispatch(publishPost(res.id));

    navigate(`/posts/${res.id}`);
  };

  return (
    <PostForm
      initialData={null}
      onSubmitDraft={handleDraft}
      onSubmitPublish={handlePublish}
    />
  );
}

export default CreatePost;
