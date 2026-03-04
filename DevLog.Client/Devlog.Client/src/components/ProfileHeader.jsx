import React from "react";

function ProfileHeader({ profile }) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-700 pb-6">
      <img
        src={profile?.profileImage || "/default-avatar.png"}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover"
      />

      <div>
        <h2 className="text-2xl font-semibold">
          {profile?.username || "User"}
        </h2>

        <p className="text-gray-400">{profile?.email}</p>
        <p className="mt-2 text-sm">{profile?.bio}</p>

        <div className="flex gap-6 mt-4 text-sm">
          <span>
            <strong>{profile?.publishedPosts?.length || 0}</strong> Published
          </span>

          <span>
            <strong>{profile?.draftPosts?.length || 0}</strong> Drafts
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
