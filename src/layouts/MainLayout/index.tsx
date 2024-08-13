import React from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";

const MainLayout = ({ children }: any) => {
  return (
    <>
      <Header />
      <div className="flex items-start mt-24">
        <div className="w-1/5">
        <Sidebar />
        </div>
        <div className="px-16 py-14 flex-1  bg-[#F0F6FF]">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
