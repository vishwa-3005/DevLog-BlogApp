import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import BlogEditor from "./BlogEditor.jsx";

function PostForm({ initialData, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        thumbnail: null,
      });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Editor */}
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
          <p className="text-red-400 text-sm mt-2">{errors.content.message}</p>
        )}
      </div>

      {/* Settings */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-6 h-fit">
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Title</label>

          <input
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          {errors.title && (
            <p className="text-red-400 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            {...register("description", { required: true })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block mb-2 font-medium">Thumbnail</label>

          <input type="file" {...register("thumbnail")} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default PostForm;
