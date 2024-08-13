import React from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";

const MainLayout = ({ children }: any) => {
  return (
    <>
      <Header />
      <div className="flex items-start mt-24">
        <Sidebar />
        <div className="p-2">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
