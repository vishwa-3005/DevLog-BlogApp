import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import BlogEditor from "../components/BlogEditor";
import { createPost, publishPost } from "../features/posts/postSlice";
import { toast } from "react-toastify";
function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnail: null,
    },
  });

  const onSubmit = async (data, publish = false) => {
    try {
      const formData = new FormData();

      // IMPORTANT: keys must match DTO property names exactly
      formData.append("Title", data.title);
      formData.append("Content", data.content);
      formData.append("Description", data.description);

      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("Thumbnail", data.thumbnail[0]);
      }

      const result = await dispatch(createPost(formData)).unwrap();
      const createdId = result.id;

      if (publish) {
        await dispatch(publishPost(createdId)).unwrap();
        toast.success("Post created successfully");
        navigate(`/posts/${createdId}`);
      } else {
        navigate(`/posts`);
      }
    } catch (error) {
      console.error("Create failed:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data, false))}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT — EDITOR */}
          <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <label className="block mb-3 font-medium">Content</label>

            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <BlogEditor value={field.value} onChange={field.onChange} />
              )}
            />

            {errors.content && (
              <p className="text-red-400 text-sm mt-2">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* RIGHT — SETTINGS PANEL */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-6 h-fit">
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium">
                Short Description
              </label>
              <textarea
                maxLength={200}
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block mb-2 font-medium">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                className="block w-full text-sm text-zinc-400
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-emerald-600 file:text-white
                           hover:file:bg-emerald-700"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-emerald-400 to-indigo-500 text-black font-semibold hover:opacity-90 transition"
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
