import BreadCrumb from "@app/components/Breadcrumb";
import SubTaskContent from "@app/components/SubTaskContent";
import Link from "next/link";
import React from "react";

const SubTaskPage = () => {
  return (
    <div className="w-full">
      <BreadCrumb title="Sub Tasks">
        <Link
          href={`/admin/tasks/subtask/create`}
          className="px-2.5 py-2.5 text-md text-white bg-[#036EFF] rounded-2xl"
        >
          Create Sub-Task
        </Link>
      </BreadCrumb>
      <div className="mt-10">
        <SubTaskContent />
      </div>
    </div>
  );
};

export default SubTaskPage;
