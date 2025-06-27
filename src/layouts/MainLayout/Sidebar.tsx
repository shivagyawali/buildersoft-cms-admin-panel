"use client";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import { logout } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";
import { menuItems } from "@app/constants/menu-items/rootIndex";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthRedirect();
  const pathname = usePathname();
  return (
    <div className="w-64 h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 text-gray-800 fixed shadow-2xl flex flex-col py-6 transition-all duration-500">
      <div className="px-5 pt-10 pb-6 flex-grow">
        <div className="flex flex-col gap-1">
          {user &&
            menuItems.map((menu, index) => {
              const clean = (path:any) => path.replace(/^\/admin/, "");
              const isActive = clean(pathname).includes(clean(menu.path));

              
              return (
                <div
                  key={index}
                  className={`relative flex items-center p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-200 shadow-lg"
                      : "hover:bg-indigo-100 hover:shadow-md"
                  }`}
                >
                  <Link
                    href={menu.path}
                    className={`flex items-center w-full transition-colors duration-300 ${
                      isActive
                        ? "text-indigo-800 font-bold"
                        : "text-gray-700 hover:text-indigo-700"
                    }`}
                  >
                    <span className="font-semibold text-sm tracking-wider uppercase">
                      {menu.name}
                    </span>
                  </Link>
                  <div
                    className={`absolute left-0 h-full w-1.5 bg-indigo-500 rounded-r-sm transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
                    }`}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="px-5 pb-8">
        <button
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-rose-600 font-semibold text-sm tracking-wider uppercase rounded-xl hover:bg-rose-100 transition-all duration-300 hover:shadow-md"
          onClick={() => dispatch(logout())}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3h3a3 3 0 013 3v1"
            ></path>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
