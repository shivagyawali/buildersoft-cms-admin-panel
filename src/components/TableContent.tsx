import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";

const TableContent = ({
  dashboard,
  data,
}: {
  dashboard?: boolean;
  data: any;
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:flex px-6 py-4 bg-gray-100 border rounded-2xl text-sm font-semibold text-gray-600">
        <div className="w-1/2 px-4">Task</div>
        <div className="w-1/5 px-4">Project</div>
        <div className="w-1/5 px-4">Company</div>
        <div className="w-1/6 px-4">Created</div>
        <div className="w-1/6 px-4 text-center">Action</div>
      </div>

      {data?.map((task: any, idx: number) => {
        return (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 bg-white border rounded-2xl shadow hover:shadow-md transition-all"
          >
            {/* Task Details */}
            <div className="w-full md:w-1/2 mb-2 px-4 md:mb-0">
              <Link
                href={`/admin/tasks/${task?.id}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {task?.title || task?.name}
              </Link>
              <p className="text-sm text-gray-500 line-clamp-2">
                {task?.description}
              </p>
            </div>

            {/* Project */}
            <div className="w-full md:w-1/5 mb-2 px-4 md:mb-0">
              <p className="text-sm font-medium">
                {task?.project?.name || "—"}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task?.project?.status === "INPROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : task?.project?.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {task?.project?.status || "Unknown"}
              </span>
            </div>

            {/* Company */}
            <div className="w-full md:w-1/5 mb-2 md:mb-0">
              <p className="text-sm font-semibold text-gray-800">
                {task?.company?.name || "—"}
              </p>
              <p className="text-xs text-gray-500">
                {task?.company?.email || "—"}
              </p>
              <span className="text-[10px] uppercase font-medium tracking-wide text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {task?.company?.role || "N/A"}
              </span>
            </div>

            {/* Created Date */}
            <div className="w-full md:w-1/6 mb-2 md:mb-0 text-sm text-gray-600">
              {task?.createdAt}
            </div>

            {/* Action */}
            <div className="w-full md:w-1/6 flex justify-center md:justify-end">
              <Link
                href={`/admin/tasks/${task?.id}`}
                className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
              >
                View <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableContent;
