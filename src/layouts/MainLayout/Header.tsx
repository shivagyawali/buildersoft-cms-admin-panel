"use client";
import React from "react";
import {
  FgNotificationBadge,
  FgNotificationIcon,
} from "@app/constants/SVGCollection";
import ProfileDropdown from "@app/components/custom-ui/ProfileDropdown";

const Header = ({ user }: any) => {
  const notificationBadge = true;

  return (
    <div className="p-2 z-40 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <p className="text-2xl font-semibold">BuilderSoft CMS</p>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="relative">
              <FgNotificationIcon />
              {notificationBadge && (
                <div className="absolute top-0.5 left-3">
                  <FgNotificationBadge />
                </div>
              )}
            </div>
          </div>
            <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
};

export default Header;
