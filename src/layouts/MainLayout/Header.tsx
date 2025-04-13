"use client";
import React from "react";
import Image from "next/image";
import avatar from "@app/assets/images/avatar.png";
import {
  FgNotificationBadge,
  FgNotificationIcon,
} from "@app/constants/SVGCollection";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = ({user}:any) => {
  const notificationBadge = true;

  return (
    <div className="p-2 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold">BuilderSoft CMS</p>
        </div>
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
            <Link
              href="/admin/profile"
              className="flex items-center gap-5 cursor-pointer"
            >
              <div className="text-right">
                <p className="text-[#0D062D] text-base">{user?.name}</p>
                <p className="text-[#787486] text-sm">{user?.role}</p>
              </div>
              <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
                <Image
                  src={user?.avatar ?? avatar}
                  alt={user?.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
