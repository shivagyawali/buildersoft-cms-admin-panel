import React from "react";
import Image from "next/image";
import avatar from "@app/assets/images/avatar.png";
import {
  FgNotificationBadge,
  FgNotificationIcon,
} from "@app/constants/SVGCollection";

const Header = () => {
  const notificationBadge = true;
  return (
    <div className="p-2 bg-white shadow-md z-50 fixed w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold">Construction v2</p>
        </div>
        <div className="flex items-center gap-8">
          <input
            type="text"
            className="w-[328px] border border-[#9A93B3] rounded-md p-2 outline-none"
          />
          <div className="flex items-center gap-8">
            <div className="relative">
              <FgNotificationIcon />
              {notificationBadge && (
                <div className="absolute top-0.5 left-3">
                  <FgNotificationBadge />
                </div>
              )}
            </div>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-[#0D062D] text-base">Anima Agrawal</p>
                <p className="text-[#787486] text-sm">U.P, India</p>
              </div>
              <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  src={avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
