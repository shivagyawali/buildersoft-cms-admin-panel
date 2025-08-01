import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";

const TableContent = ({
  dashboard,
  data,
}: {
  dashboard?: boolean;
  data: any;
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 uppercase tracking-wide shadow-sm">
        <div className="col-span-5 px-4">Task</div>
        <div className="col-span-2 px-4">Project</div>
        <div className="col-span-2 px-4">Company</div>
        <div className="col-span-2 px-4">Created</div>
        <div className="col-span-1 px-4 text-center">Action</div>
      </div>

      {/* Table Rows */}
      {data?.map((task: any, idx: number) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
        >
          {/* Task Details */}
          <div className="col-span-1 md:col-span-5 px-4 mb-3 md:mb-0">
            <Link
              href={`/admin/tasks/${task?.id}`}
              className="text-sm font-semibold text-blue-600 hover:underline transition-colors duration-200"
            >
              {task?.title || task?.name}
            </Link>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {task?.description}
            </p>
          </div>

          {/* Project */}
          <div className="col-span-1 md:col-span-2 mb-3 md:mb-0 px-4">
            <p className="text-sm font-medium text-gray-800">
              {task?.project?.name || "—"}
            </p>
            <span
              className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium transition-all duration-200 ${
                task?.project?.status === "INPROGRESS"
                  ? "bg-primamry-100 text-primary-700"
                  : task?.project?.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {task?.project?.status || "Unknown"}
            </span>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2 mb-3 md:mb-0 px-4">
            <p className="text-sm font-semibold text-gray-800">
              {task?.company?.name || "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {task?.company?.email || "—"}
            </p>
            <span className="inline-block mt-1 text-[10px] uppercase font-medium tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {task?.company?.role || "N/A"}
            </span>
          </div>

          {/* Created Date */}
          <div className="col-span-1 md:col-span-2 mb-3 md:mb-0 px-4 text-sm text-gray-600">
            {task?.createdAt
              ? formatDistanceToNow(new Date(task.createdAt), {
                  addSuffix: true,
                })
              : "—"}
          </div>

          {/* Action */}
          <div className="col-span-1 md:col-span-1 flex justify-center md:justify-end px-4">
            <Link
              href={`/admin/tasks/${task?.id}`}
              className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableContent;
