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
    // Convert to FormData because of file upload
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("Dob", data.Dob);
    formData.append("Bio", data.Bio);
    formData.append("password", data.password);

    if (data.profile[0]) {
      formData.append("profile", data.profile[0]);
    }

    const result = await dispatch(signUp(formData));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Registration successful");
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>

      <input
        placeholder="Full Name"
        {...register("fullName", { required: "Full name is required" })}
      />
      {errors.fullName && <p>{errors.fullName.message}</p>}

      <input placeholder="Username" {...register("username")} />

      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="date"
        {...register("Dob", { required: "Date of birth is required" })}
      />
      {errors.Dob && <p>{errors.Dob.message}</p>}

      <textarea
        placeholder="Bio"
        {...register("Bio", { required: "Bio is required" })}
      />
      {errors.Bio && <p>{errors.Bio.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Minimum 6 characters",
          },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="file" accept="image/*" {...register("profile")} />

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default Register;
