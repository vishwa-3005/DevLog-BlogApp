import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import BlogEditor from "./BlogEditor.jsx";
import { generateThumbnail } from "../features/ai/aiSlice.js";

function PostForm({ initialData, onSubmitDraft, onSubmitPublish, loading }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnail: null,
      tags: "", // ✅ NEW
    },
  });

  const dispatch = useDispatch();

  const { thumbnailUrl, requesting: aiLoading } = useSelector(
    (state) => state.ai,
  );

  // ✅ RESET WHEN EDITING
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        thumbnail: null,
        tags: initialData.tags?.join(", ") || "", // ✅ important
      });
    }
  }, [initialData, reset]);

  // ✅ GENERATE THUMBNAIL
  const handleGenerate = () => {
    const title = watch("title");
    if (!title) return;
    dispatch(generateThumbnail(title));
  };

  const thumbnailFile = watch("thumbnail");

  // ✅ PREVIEW LOGIC
  let previewUrl = null;
  if (thumbnailFile?.[0]) {
    previewUrl = URL.createObjectURL(thumbnailFile[0]);
  } else if (thumbnailUrl) {
    previewUrl = thumbnailUrl;
  }

  // ✅ FINAL SUBMIT FORMATTER (IMPORTANT)
  const formatSubmit = (data) => {
    return {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
  };

  return (
    <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* ✅ TAG INPUT */}
        <div>
          <label className="block mb-2 font-medium">Tags</label>

          <input
            {...register("tags")}
            placeholder="dotnet, backend, react"
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <p className="text-xs text-zinc-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block mb-2 font-medium">Thumbnail</label>

          <input
            type="file"
            id="thumbnailUpload"
            accept="image/*"
            {...register("thumbnail")}
            className="hidden"
          />

          <label
            htmlFor="thumbnailUpload"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
          >
            📁 Choose Thumbnail
          </label>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!watch("title") || aiLoading}
            className="mt-3 w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700"
          >
            {aiLoading ? "Generating..." : "Generate with AI"}
          </button>

          {watch("thumbnail")?.[0]?.name && (
            <p className="mt-2 text-sm text-zinc-400">
              Selected: {watch("thumbnail")[0].name}
            </p>
          )}
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-zinc-400 mb-2">Preview</p>

            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-full rounded-lg border border-zinc-700 object-cover max-h-56"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => onSubmitDraft(formatSubmit(d)))}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => onSubmitPublish(formatSubmit(d)))}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
          >
            Publish
          </button>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
