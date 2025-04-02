import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <>
      <Header />
      <div className="flex items-start mt-16">
        <div className="w-1/5">
          <Sidebar />
        </div>
        <div className="px-16 py-14 flex-1  bg-[#F0F6FF] min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default UserLayout;
