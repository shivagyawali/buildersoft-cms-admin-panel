"use client";
import useAuthRedirect from "@app/app/hooks/useAuthRedirect";
import { assignedUsers } from "@app/constants/menu-items/rootIndex";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminProfilePage = () => {
  const { user } = useAuthRedirect();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-md p-10 flex flex-col items-center text-center transition-all hover:shadow-xl duration-300">
        <div className="relative w-40 h-40 border-4 border-blue-500 rounded-full overflow-hidden shadow-lg">
          <Image
            src={user?.avatar || ""}
            alt="Profile Image"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-blue-600 uppercase tracking-wide mt-1">
          {user?.role}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Joined on {new Date(user?.company?.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* User Tasks */}
      {user?.tasks?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-md p-8 transition-all hover:shadow-xl duration-300 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Tasks
          </h3>
          <div className="space-y-4">
            {user?.tasks.map((task: any, idx: any) => (
              <div
                key={idx}
                className="p-5 border border-gray-200 rounded-2xl hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-800">
                    {task.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {task.isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                <div className="text-xs text-gray-500 mt-3 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">Project:</span>{" "}
                    {task.project?.name} ({task.project?.status})
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Company:</span>{" "}
                    {task.company?.name} ({task.company?.email})
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Created:</span>{" "}
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;
