"use client"
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import { assignedUsers } from "@app/constants/menu-items/rootIndex";
import Image from "next/image";
import Link from "next/link";

import React from "react";


const AdminProfilePage = () => {
 const { user } = useAuthRedirect();
return (
  <div className="grid grid-cols-3 gap-10">
    <div className="col-span-1">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-2 border-blue-600 p-1">
            <Image
              src={user?.avatar || ""}
              alt="Profile Image"
              width={500}
              height={500}
              className="rounded-full w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-gray-700 font-bold mt-2">{user?.name}</p>
          <p className="font-thin text-gray-500 ">{user?.role}</p>
          <p className="font-thin text-gray-500">{user?.createdAt}</p>
        </div>
      </div>
    </div>
    <div className="col-span-1 bg-white p-8 px-5 rounded-[20px]">
      <div className="flex items-center justify-between">
        <p>Projects</p>
        <Link href={"/admin/project/create"} className="text-sm text-[#036EFF]">
          View More
        </Link>
      </div>
      <div className="flex flex-wrap gap-8 mt-6">
        {assignedUsers.map((user, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl">
              <Image
                src={user.image}
                alt=""
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default AdminProfilePage;
