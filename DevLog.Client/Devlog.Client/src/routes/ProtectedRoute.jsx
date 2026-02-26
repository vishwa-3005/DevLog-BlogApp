import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/tokenService.js";

function ProtectedRoute() {
  const accessToken = getAccessToken();
  console.log("ProtectedRoute token:", getAccessToken());
  if (accessToken) return <Outlet />;
  else return <Navigate to={"/login"} />;
}

export default ProtectedRoute;
