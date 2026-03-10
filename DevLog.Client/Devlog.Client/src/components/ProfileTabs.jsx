import React from "react";

function ProfileTabs({ activeTab, setActiveTab, profile }) {
  const publishedCount = profile?.publishedPosts?.length || 0;
  const draftCount = profile?.draftPosts?.length || 0;

  return (
    <div className="flex justify-center border-b border-zinc-800">
      {[
        { key: "published", label: "Published", count: publishedCount },
        { key: "draft", label: "Drafts", count: draftCount },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`
            relative px-6 py-3 text-sm font-medium transition
            ${
              activeTab === tab.key
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }
          `}
        >
          {tab.label} ({tab.count})
          {activeTab === tab.key && (
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-white"></span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
