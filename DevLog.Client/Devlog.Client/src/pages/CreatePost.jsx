import { createPost, publishPost } from "../features/posts/postSlice";

function CreatePost() {
  const handleSubmit = async (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Content", data.content);
    formData.append("Description", data.description);
    formData.append("Thumbnail", data.thumbnail[0]);

    await dispatch(createPost(formData));
  };

  return <PostForm initialData={null} onSubmit={handleSubmit} />;
}

export default CreatePost;
