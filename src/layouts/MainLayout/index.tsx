import React from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";

const MainLayout = ({ children }: any) => {
  return (
    <>
      <div className="w-full bg-white z-50 fixed">
        <Header />
      </div>
      <div className="flex mt-[60px]">
        <Sidebar />
        <div className="flex-1 pl-72 pr-8 py-8 bg-[#F0F6FF] min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
