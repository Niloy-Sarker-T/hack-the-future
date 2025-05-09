import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Pattern from "@/components/ui/pattern";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      {/* <div className="min-h-screen bg-transparent text-white"> */}
      <Navbar />
      <Pattern />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
