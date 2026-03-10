import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import BlogEditor from "./BlogEditor.jsx";
import { generateThumbnail } from "../features/ai/aiSlice.js";

function PostForm({ initialData, onSubmitDraft, onSubmitPublish, loading }) {
  const [focusMode, setFocusMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnail: null,
      tags: "",
    },
  });

  const dispatch = useDispatch();

  const { thumbnailUrl, requesting: aiLoading } = useSelector(
    (state) => state.ai,
  );

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        thumbnail: null,
        tags: initialData.tags?.join(", ") || "",
      });
    }
  }, [initialData, reset]);

  const handleGenerate = () => {
    const title = watch("title");
    if (!title) return;
    dispatch(generateThumbnail(title));
  };

  const thumbnailFile = watch("thumbnail");

  let previewUrl = null;
  if (thumbnailFile?.[0]) previewUrl = URL.createObjectURL(thumbnailFile[0]);
  else if (thumbnailUrl) previewUrl = thumbnailUrl;

  const formatSubmit = (data) => ({
    ...data,
    tags: data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  });

  return (
    <form className="flex gap-8 min-h-[calc(100vh-120px)]">
      {/* ================= LEFT — EDITOR ================= */}
      <div className="flex-1">
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) => (
            <BlogEditor
              value={field.value || ""}
              onChange={field.onChange}
              onFocus={() => setFocusMode(true)}
              onBlur={() => setFocusMode(false)}
            />
          )}
        />

        {errors.content && (
          <p className="text-red-400 text-sm mt-2">{errors.content.message}</p>
        )}
      </div>

      {/* ================= RIGHT — SETTINGS ================= */}
      <div className="w-[360px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 h-fit">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("description", { required: true })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* TAGS */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            {...register("tags")}
            placeholder="dotnet, backend"
            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* THUMBNAIL */}
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>

          <input
            type="file"
            id="thumbnailUpload"
            accept="image/*"
            {...register("thumbnail")}
            className="hidden"
          />

          <label
            htmlFor="thumbnailUpload"
            className="flex justify-center px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
          >
            Choose Thumbnail
          </label>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!watch("title") || aiLoading}
            className="mt-3 w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700"
          >
            {aiLoading ? "Generating..." : "Generate with AI"}
          </button>

          {previewUrl && (
            <img
              src={previewUrl}
              className="mt-4 rounded-lg border border-zinc-700 max-h-56 w-full object-cover"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => onSubmitDraft(formatSubmit(d)))}
            className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit((d) => onSubmitPublish(formatSubmit(d)))}
            className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            Publish
          </button>
        </div>
      </div>
    </form>
  );
}

export default PostForm;
