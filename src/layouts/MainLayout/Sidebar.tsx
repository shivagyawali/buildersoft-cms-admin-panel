"use client";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import { menuItems } from "@app/constants/menu-items/rootIndex";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const { user } = useAuthRedirect();
  const pathname = usePathname();
  return (
    <div className="w-64 h-screen bg-gradient-to-br  text-gray-800 fixed shadow-2xl flex flex-col py-6 transition-all duration-500">
      <div className="px-5 pt-10 pb-6 flex-grow">
        <div className="flex flex-col gap-4">
          {user &&
            menuItems.map((menu, index) => {
              const clean = (path: any) => path.replace(/^\/admin/, "");
              const isActive = clean(pathname).includes(clean(menu.path));

              return (
                <div
                  key={index}
                  className={`relative flex items-center rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-primary-200 shadow-lg"
                      : "hover:bg-primary-100 hover:shadow-md"
                  }`}
                >
                  <Link
                    href={menu.path}
                    className={`flex items-center w-full p-3 transition-colors duration-300 ${
                      isActive
                        ? "text-primary-800 font-bold"
                        : "text-gray-700 hover:text-primary-700"
                    }`}
                  >
                    <span className="font-semibold text-sm tracking-wider uppercase">
                      {menu.name}
                    </span>
                  </Link>
                  <div
                    className={`absolute left-0 h-full w-1.5 bg-primary-500 rounded-r-sm transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
                    }`}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
