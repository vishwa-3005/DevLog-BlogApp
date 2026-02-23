import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const AuthStatus = true;
  if (AuthStatus) return <Outlet />;
  else return <Navigate to={"/login"} />;
}

export default ProtectedRoute;
