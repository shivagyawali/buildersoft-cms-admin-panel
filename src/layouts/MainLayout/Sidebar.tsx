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
    <div className="w-96 h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 fixed shadow-xl flex flex-col transition-all duration-300 py-4">
      <div className="px-6 pt-12 pb-8 flex-grow">
        <div className="flex flex-col gap-2 ">
          {user &&
            menuItems.map((menu, index) => {
              const isActive = pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`group relative flex items-center p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-100 shadow-md"
                      : "hover:bg-indigo-50 hover:shadow-md"
                  }`}
                >
                  <Link
                    href={menu.path}
                    className={`flex items-center gap-4 w-full transition-colors duration-200 ${
                      isActive
                        ? "text-indigo-700"
                        : "text-gray-600 group-hover:text-indigo-600"
                    }`}
                  >
                    <span
                      className={`text-xl transform transition-transform duration-200 ${
                        isActive ? "scale-105" : "group-hover:scale-105"
                      }`}
                    >
                      {menu.icon}
                    </span>
                    <span className="font-semibold text-sm tracking-wide">
                      {menu.name}
                    </span>
                  </Link>
                  <div
                    className={`absolute left-0 h-full w-1 bg-indigo-600 transition-opacity duration-300 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="px-6 pb-12">
        <button
          className="w-full flex items-center gap-4 p-3 text-gray-600 hover:text-rose-500 font-semibold text-sm tracking-wide rounded-xl hover:bg-rose-50 transition-all duration-300 hover:shadow-md"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
            ></path>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
