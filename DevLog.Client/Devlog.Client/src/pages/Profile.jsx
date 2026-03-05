import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProfile } from "../features/profile/profileSlice";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import ProfileTabs from "../components/ProfileTabs";

function Profile() {
  const [activeTab, setActiveTab] = useState("published");

  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, profile } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  /* -------- LOADING -------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-zinc-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  /* -------- ERROR -------- */
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  /* -------- OWNER CHECK -------- */
  const isOwner = user?.id === profile?.userId;
  console.log(isOwner);

  /* -------- POSTS FILTER -------- */
  const posts =
    activeTab === "published"
      ? profile.publishedPosts || []
      : profile.draftPosts || [];

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <ProfileHeader profile={profile} isOwner={isOwner} />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
      />

      <PostGrid posts={posts} />
    </div>
  );
}

export default Profile;
