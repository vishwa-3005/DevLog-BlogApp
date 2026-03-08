import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function MainLayout() {
  const location = useLocation();

  // pages that need full width (editor pages)
  const isWidePage =
    location.pathname.includes("/create") ||
    location.pathname.includes("/edit");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      <main className="grow pt-6 lg:pt-8">
        {isWidePage ? (
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10">
            <Outlet />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Outlet />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default MainLayout;
