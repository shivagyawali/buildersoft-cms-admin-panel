"use client";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import { menuItems } from "@app/constants/menu-items/rootIndex";
import { FgCloseIcon } from "@app/constants/SVGCollection";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuthRedirect();
  const pathname = usePathname();
  
  return (
    <div className="w-full h-full bg-gradient-to-br text-gray-800 shadow-2xl flex flex-col py-4 sm:py-6 transition-all duration-500">
      <div className="lg:hidden flex justify-end px-4 pb-2">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Close menu"
        >
          <FgCloseIcon />
        </button>
      </div>
      
      <div className="px-4 sm:px-5 pt-6 sm:pt-10 pb-6 flex-grow overflow-y-auto">
        <div className="flex flex-col gap-3 sm:gap-4">
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
                    onClick={() => {
                      if (window.innerWidth < 1024 && onClose) {
                        onClose();
                      }
                    }}
                    className={`flex items-center w-full p-2.5 sm:p-3 transition-colors duration-300 ${
                      isActive
                        ? "text-primary-800 font-bold"
                        : "text-gray-700 hover:text-primary-700"
                    }`}
                  >
                    <span className="font-semibold text-xs sm:text-sm tracking-wider uppercase">
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
