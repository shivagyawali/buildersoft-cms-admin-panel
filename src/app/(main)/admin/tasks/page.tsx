import TableContent from "@app/components/TableContent";
import Link from "next/link";
import React from "react";

const AdminTasks = () => {
  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[#9A93B3] text-xl font-semibold">
            Projects / Addodle
          </p>
          <div className="flex items-center gap-10 mt-5">
            <p className="text-2xl">Addodle</p>
            <p className="text-base text-[#4BA665] rounded-full bg-green-100 px-6 py-3">
              OnTrack
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-end">
          <Link href={"/admin/tasks/create"} className="text-lg px-7 py-4 text-white bg-blue-500 rounded-full ">
            Assign Task
          </Link>
          <div className="pl-2.5">
            <p className="text-[#656565] text-center mb-3">Time Spent</p>
            <p className="text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
              2M : 0W : 0D
            </p>
          </div>
          <div>
            <p className="text-[#656565] text-center mb-3">Deadline</p>
            <p className="text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
              6M : 0W : 0D
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl">
        <TableContent />
      </div>
    </div>
  );
};

export default AdminTasks;
