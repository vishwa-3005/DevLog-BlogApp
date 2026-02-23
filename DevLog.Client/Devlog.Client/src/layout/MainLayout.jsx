import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
function MainLayout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default MainLayout;
