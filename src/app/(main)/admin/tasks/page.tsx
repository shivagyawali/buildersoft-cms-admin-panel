import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const AdminTasks = () => {
  return (
    <div className="w-full">
      <BreadCrumb title="Tasks">
        <Link
          href={"/admin/tasks/create"}
          className="text-lg px-6 py-3 text-white bg-blue-500 rounded-2xl "
        >
          Assign Task
        </Link>
      </BreadCrumb>

      <div className="bg-white p-8 rounded-2xl mt-6">
        <div className="pb-6">
          <Filter />
        </div>
        <TableContent data={tasks} />
      </div>
    </div>
  );
};

export default AdminTasks;
