import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, accessToken, loading } = useSelector((state) => state.auth);
  const handelLogin = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate("/posts");
    }
    console.log(accessToken);
  };
  return (
    <>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button
          type="submit"
          onClick={(e) => handelLogin(e)}
          disabled={loading}
        >
          {loading ? "logging in.." : "login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
export default Login;
