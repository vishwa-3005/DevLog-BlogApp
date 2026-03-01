import React from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../services/axiosInstance.js";

function BlogEditor({ value, onChange }) {
  const handleImageUpload = async (blobInfo) => {
    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    try {
      const response = await axiosInstance.post("/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.location;
    } catch (error) {
      console.error("Image upload failed", error);
      throw new Error("Image upload failed");
    }
  };
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        skin: "oxide-dark",
        content_css: "dark",
        height: 600,
        menubar: false,
        plugins: [
          "lists",
          "link",
          "image",
          "table",
          "code",
          "codesample",
          "autolink",
          "preview",
          "fullscreen",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist | link image | codesample code | " +
          "preview fullscreen",
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        paste_data_images: false,
        branding: false,
      }}
    ></Editor>
  );
}

export default BlogEditor;
