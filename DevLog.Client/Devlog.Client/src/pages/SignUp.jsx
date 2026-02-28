import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("Dob", data.Dob);
    formData.append("Bio", data.Bio);
    formData.append("password", data.password);

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }

    const result = await dispatch(signUp(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 py-10">
      <div className="w-full max-w-3xl">
        {/* Gradient Border */}
        <div className="p-px rounded-2xl bg-linear-to-r from-indigo-500/30 to-emerald-400/30">
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl shadow-black/50">
            <h2 className="text-2xl font-bold text-white mb-1">
              Create Account
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Build your developer identity
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Grid Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Full Name"
                  {...register("fullName")}
                  className="field"
                />

                <input
                  placeholder="Username"
                  {...register("username")}
                  className="field"
                />

                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className="field"
                />

                <input
                  type="date"
                  {...register("Dob")}
                  className="field appearance-none"
                />
              </div>

              <textarea
                placeholder="Short Bio"
                rows={4}
                {...register("Bio")}
                className="field"
              />

              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="field"
              />

              {/* File Upload */}
              <div className="flex items-center justify-between border border-zinc-800 rounded-lg px-4 py-2 bg-zinc-800">
                <span className="text-sm text-zinc-400">Profile Image</span>
                <input
                  type="file"
                  accept="image/*"
                  {...register("profile")}
                  className="text-sm text-white file:mr-3 file:px-3 file:py-1 file:rounded-md file:bg-indigo-500 file:text-black file:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-500 to-emerald-400 text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>

            {error && (
              <div className="mt-5 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
