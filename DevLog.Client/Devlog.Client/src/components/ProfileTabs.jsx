import React from "react";

function ProfileTabs({ activeTab, setActiveTab, profile }) {
  const publishedCount = profile?.publishedPosts?.length || 0;
  const draftCount = profile?.draftPosts?.length || 0;

  return (
    <div className="flex justify-center mt-6 border-b border-gray-700">
      <button
        onClick={() => setActiveTab("published")}
        className={`px-6 py-3 font-medium ${
          activeTab === "published"
            ? "border-b-2 border-white text-white"
            : "text-gray-500"
        }`}
      >
        Published ({publishedCount})
      </button>

      <button
        onClick={() => setActiveTab("draft")}
        className={`px-6 py-3 font-medium ${
          activeTab === "draft"
            ? "border-b-2 border-white text-white"
            : "text-gray-500"
        }`}
      >
        Drafts ({draftCount})
      </button>
    </div>
  );
}

export default ProfileTabs;
