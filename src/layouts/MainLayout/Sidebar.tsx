import { menuItems } from "@app/constants/menu-items/rootIndex";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="w-1/5 h-screen bg-white px-6 pt-8 fixed">
      <div className="flex flex-col gap-4 text-sm font-semibold">
        {menuItems.map((menu, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Link
              href={menu.path}
              className="flex items-center gap-4 text-[#5D7285]"
            >
              {menu.icon}
              {menu.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
