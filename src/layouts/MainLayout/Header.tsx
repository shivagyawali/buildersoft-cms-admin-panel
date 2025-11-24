"use client";
import React from "react";
import {
  FgNotificationBadge,
  FgNotificationIcon,
  FgMenuIcon,
} from "@app/constants/SVGCollection";
import ProfileDropdown from "@app/components/custom-ui/ProfileDropdown";

const Header = ({ user, toggleSidebar }: any) => {
  const notificationBadge = true;

  return (
    <div className="p-1.5 sm:p-2 z-40 bg-white">
      <div className="max-w-8xl mx-auto px-auto sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-1 sm:gap-5 md:gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="scale-90 sm:scale-100">
              <FgMenuIcon />
            </div>
          </button>
          <p className="text-base sm:text-sm md:text-lg lg:text-xl font-semibold whitespace-nowrap">
            BuilderSoft CMS
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <div className="flex items-center">
            <div className="relative scale-75 sm:scale-90 md:scale-100">
              <FgNotificationIcon />
              {notificationBadge && (
                <div className="absolute top-0.5 left-3">
                  <FgNotificationBadge />
                </div>
              )}
            </div>
          </div>
          <div className="scale-90 sm:scale-95 md:scale-100">
            <ProfileDropdown user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
