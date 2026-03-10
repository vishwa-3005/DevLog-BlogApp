import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../services/axiosInstance.js";

function BlogEditor({ value, onChange }) {
  const handleImageUpload = async (blobInfo) => {
    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    try {
      const response = await axiosInstance.post("/api/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.location;
    } catch (error) {
      console.error("Image upload failed", error);
      throw new Error("Image upload failed");
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        value={value || ""} // ✅ SAFE FIX (prevents crash)
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 650, // ✅ FIXED HEIGHT (no crash)

          menubar: false,
          skin: "oxide-dark",
          content_css: "dark",

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
            "bullist numlist | link image | codesample code | preview fullscreen",

          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          paste_data_images: false,
          branding: false,

          /* ✅ SAFE DARK STYLE */
          content_style: `
            body {
              background-color: #09090b;
              color: #e4e4e7;
              font-family: Inter, system-ui, sans-serif;
              padding: 18px;
              line-height: 1.7;
              font-size: 16px;
            }

            h1,h2,h3,h4,h5,h6 {
              color: #fafafa;
              margin-top: 1.2em;
            }

            a { color: #818cf8; }

            pre {
              background: #111827;
              padding: 14px;
              border-radius: 10px;
              overflow-x: auto;
            }

            code {
              background: #18181b;
              padding: 2px 6px;
              border-radius: 6px;
            }
          `,
        }}
      />
    </div>
  );
}

export default BlogEditor;
