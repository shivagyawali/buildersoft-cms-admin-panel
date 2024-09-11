import { menuItems } from "@app/constants/menu-items/rootIndex";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white px-6 pt-12 fixed shadow-lg">
      <div className="flex flex-col gap-6">
        {menuItems.map((menu, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-2 transition-colors duration-300 rounded-lg hover:bg-gray-100"
          >
            <Link
              href={menu.path}
              className="flex items-center gap-4 text-[#5D7285] hover:text-[#1D4ED8] cursor-pointer"
            >
              <span className="text-2xl">{menu.icon}</span>
              <span className="font-medium text-base">{menu.name}</span>
            </Link>
          </div>
        ))}
        <div className="absolute bottom-20 w-full">
          <button className="text-[#5D7285] text-left hover:text-[#1D4ED8] cursor-pointer p-2 hover:bg-gray-100 rounded-lg w-full">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
