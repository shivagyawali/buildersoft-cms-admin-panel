"use client";
import React, { useState } from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";
import { Providers } from "@app/app/components/Providers";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import Loading from "@app/components/Loading";

const MainLayout = ({ children }: any) => {
  const { user } = useAuthRedirect();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72 2xl:w-80
            ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:translate-x-0`}
        >
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </aside>
        
        <main className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen overflow-y-auto transition-all duration-300">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
