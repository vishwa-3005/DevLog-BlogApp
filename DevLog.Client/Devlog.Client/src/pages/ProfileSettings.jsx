import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { editProfile, getProfile } from "../features/profile/profileSlice";

function ProfileSettings() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, profile } = useSelector((state) => state.profile);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const imageFile = watch("profileImage");

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
        dob: profile.dob || "",
      });

      setPreview(profile.profileImage);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const objectUrl = URL.createObjectURL(imageFile[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("Username", data.username);
    formData.append("Email", data.email);
    formData.append("Bio", data.bio);
    formData.append("DOB", data.dob);

    if (data.profileImage?.[0]) {
      formData.append("ProfileImage", data.profileImage[0]);
    }

    await dispatch(editProfile({ id, profileData: formData }));
    navigate(`/profile/${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-zinc-400 animate-pulse">
        Loading profile...
      </div>
    );

  if (error)
    return <div className="max-w-xl mx-auto mt-10 text-red-400">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(`/profile/${id}`)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </button>

        <h2 className="text-lg font-semibold">Edit Profile</h2>

        <div />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={preview || "/default-avatar.png"}
            className="w-28 h-28 rounded-full object-cover border border-zinc-700"
          />

          <label className="cursor-pointer px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm">
            Change Photo
            <input
              type="file"
              {...register("profileImage")}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Username</label>
          <input
            {...register("username", { required: "Username required" })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Email</label>
          <input
            disabled={true}
            {...register("email", { required: "Email required" })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">Bio</label>
          <textarea
            rows="4"
            {...register("bio")}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm mb-1 text-zinc-400">
            Date of Birth
          </label>
          <input
            type="date"
            {...register("dob")}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;
