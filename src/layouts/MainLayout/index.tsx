import React from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";

const MainLayout = ({ children }: any) => {
  return (
    <>
      <Header />
      <div className="flex mt-16">
        <Sidebar />
        <div className="flex-1 pl-72 pr-8 py-8 bg-[#F0F6FF] min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
