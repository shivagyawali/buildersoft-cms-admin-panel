"use client"; // Ensures this is a client-side component

import React, { useEffect } from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation"; // Ensure to use next/navigation for Next.js 13+ routing
import { useSelector } from "react-redux";
import { Providers } from "@app/app/components/Providers";

const MainLayout = ({ children }: any) => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  // On page load, if not authenticated, redirect to login page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div className="w-full bg-white z-50 fixed">
        <Header />
      </div>
      <div className="flex mt-[60px]">
        <Sidebar />
        <div className="flex-1 pl-72 pr-8 py-8 bg-[#F0F6FF] min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
