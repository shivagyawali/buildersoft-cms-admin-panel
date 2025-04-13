"use client";
import React from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";
import { Providers } from "@app/app/components/Providers";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";

const MainLayout = ({ children }: any) => {
  const { user } = useAuthRedirect();
 
  return (
    <>
      <div className="w-full bg-white z-50 fixed">
        <Header user={user} />
      </div>
      <div className="flex mt-[60px]">
        <Sidebar user={user} />
        <div className="flex-1 pl-72 pr-8 py-8 bg-[#F0F6FF] min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
