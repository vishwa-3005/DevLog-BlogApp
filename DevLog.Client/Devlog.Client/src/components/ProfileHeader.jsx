import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileHeader({ profile, isOwner }) {
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-zinc-700 pb-6">
      <img
        src={profile.profileImage || "/default-avatar.png"}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover border border-zinc-600"
      />

      <div className="text-center md:text-left flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              @{profile.username || "user"}
            </h2>

            <p className="text-sm text-zinc-400">{profile.email}</p>
          </div>

          {isOwner && (
            <button
              onClick={() => navigate(`/profile/settings/${profile.userId}`)}
              className="px-4 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-zinc-300">{profile.bio}</p>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm text-zinc-400">
          <span>
            <strong className="text-white">
              {profile.publishedPosts?.length || 0}
            </strong>{" "}
            Published
          </span>

          <span>
            <strong className="text-white">
              {profile.draftPosts?.length || 0}
            </strong>{" "}
            Drafts
          </span>

          {profile.dob && (
            <span>
              DOB:{" "}
              <strong className="text-white">
                {new Date(profile.dob).toLocaleDateString()}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
