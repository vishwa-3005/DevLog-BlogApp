import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileHeader({ profile, isOwner }) {
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      {/* Avatar */}
      <div className="relative">
        <img
          src={profile.profileImage || "/default-avatar.png"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-zinc-700 shadow-lg"
        />

        {isOwner && (
          <span className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-zinc-900"></span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              @{profile.username || "user"}
            </h2>

            <p className="text-sm text-zinc-400 mt-1">{profile.email}</p>
          </div>

          {isOwner && (
            <button
              onClick={() => navigate(`/profile/settings/${profile.userId}`)}
              className="
                px-5 py-2 rounded-lg text-sm font-medium
                bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                transition
              "
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-zinc-300 leading-relaxed max-w-xl">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2 text-sm text-zinc-400">
          <div>
            <p className="text-xl font-semibold text-white">
              {profile.publishedPosts?.length || 0}
            </p>
            <p>Published</p>
          </div>

          <div>
            <p className="text-xl font-semibold text-white">
              {profile.draftPosts?.length || 0}
            </p>
            <p>Drafts</p>
          </div>

          {profile.dob && (
            <div>
              <p className="text-xl font-semibold text-white">
                {new Date(profile.dob).toLocaleDateString()}
              </p>
              <p>DOB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
