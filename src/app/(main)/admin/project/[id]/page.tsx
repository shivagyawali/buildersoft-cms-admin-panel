"use client";
import LineChart from "@app/components/charts/LineChart";
import PieChart from "@app/components/charts/PieChart";
import { assignedUsers } from "@app/constants/menu-items/rootIndex";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProjectDetail = () => {
  return (
    <div>
      <p className="text-3xl text-[#0E2040]">Projects</p>

      <div className="grid grid-cols-3 py-10 gap-3">
        <div className="col-span-1">
          <PieChart />
        </div>
        <div className="col-span-2">
          <LineChart />
        </div>
        <div className="col-span-2 bg-white p-8 rounded-[20px]">
          <div className="flex items-center justify-between">
            <p>Assigned Users</p>
            <div>
              <input
                type="text"
                className="w-[328px] border border-[#9A93B3] rounded-md p-2 outline-none text-xs"
                placeholder="search for anything...."
              />
            </div>
            <Link
              href={"/admin/project/create"}
              className="text-sm text-[#036EFF]"
            >
              View More
            </Link>
          </div>
          <div className="flex flex-wrap gap-12 mt-10">
            {assignedUsers.map((user, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full">
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
        <div className="col-span-1 bg-white p-8 px-5 rounded-[20px]">
          <div className="flex items-center justify-between">
            <p>Projects</p>
            <Link
              href={"/admin/project/create"}
              className="text-sm text-[#036EFF]"
            >
              View More
            </Link>
          </div>
          <div className="flex flex-wrap gap-10 mt-10">
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
    </div>
  );
};

export default ProjectDetail;
