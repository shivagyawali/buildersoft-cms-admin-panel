"use client";

import { getSingleProject } from "@app/app/redux/projectSlice";
import { AppDispatch } from "@app/app/redux/store";
import LineChart from "@app/components/charts/LineChart";
import PieChart from "@app/components/charts/PieChart";
import Comment from "@app/components/Comment";
import { assignedUsers } from "@app/constants/menu-items/rootIndex";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const ProjectDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id: any = params?.id;

  const { project, loading, error } = useSelector(
    (state: any) => state.projects || {}
  );

  useEffect(() => {
    if (id) dispatch(getSingleProject(id));
  }, [dispatch, id]);

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-3xl font-bold text-[#0E2040] mb-4">
          {project?.name}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="text-base text-[#0E2040]">{project?.createdAt}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">End Date</p>
            <p className="text-base text-[#0E2040]">2024-08-10</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Budget</p>
            <p className="text-base text-[#0E2040]">Rs. 2,00,000.00</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className="text-xs font-semibold text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2 inline-block">
              {project?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm">
          <PieChart />
        </div>
        <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm">
          <LineChart />
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0E2040]">Tasks</h3>
          <Link
            href="/admin/project/create"
            className="text-sm text-[#036EFF] font-medium"
          >
            View More
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 justify-start">
          {project?.tasks?.map((task: any, index: number) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src={`https://ui-avatars.com/api/?name=${task?.title}&format=svg&background=F9C235`}
                  alt=""
                  width={50}
                  height={50}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 text-center">
                {task?.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Users */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-semibold text-[#0E2040]">
            Assigned Users
          </h3>
          <input
            type="text"
            className="w-[300px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
            placeholder="Search for anything..."
          />
          <Link
            href="/admin/project/create"
            className="text-sm text-[#036EFF] font-medium"
          >
            View More
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 justify-start">
          {assignedUsers.map((user, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                <Image
                  src="https://ui-avatars.com/api/?background=0D8ABC&color=fff"
                  alt=""
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{user.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <Comment />
      </div>
    </div>
  );
};

export default ProjectDetail;
