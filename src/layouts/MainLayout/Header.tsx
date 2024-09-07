"use client";
import React, { useState } from "react";
import Image from "next/image";
import avatar from "@app/assets/images/avatar.png";
import {
  FgNotificationBadge,
  FgNotificationIcon,
} from "@app/constants/SVGCollection";
import { useRouter } from "next/navigation";

const Header = () => {
  const notificationBadge = true;
  const route = useRouter();
  return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold">BuilderSoft CMS</p>
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
            <div
              className="flex items-center gap-5 cursor-pointer"
              onClick={() => route.push("/admin/profile")}
            >
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
