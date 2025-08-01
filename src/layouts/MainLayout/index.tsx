"use client";
import React, { useState } from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";
import { Providers } from "@app/app/components/Providers";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import Loading from "@app/components/Loading";

const MainLayout = ({ children }: any) => {
  const { user } = useAuthRedirect();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="z-50 bg-white shadow-sm">
        <Header
          user={user}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0`}
        >
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 bg-gray-100 min-h-screen transition-all duration-300">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
