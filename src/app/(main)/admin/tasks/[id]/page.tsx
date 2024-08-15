import SubTaskForm from "@app/components/forms/TaskForm/SubTaskForm";
import SubTaskContent from "@app/components/SubTaskContent";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const SubTaskPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
      <p className="text-[#9A93B3] text-2xl">Subtask / Create SubTask</p>
      <Link href={`/admin/tasks/subtask/create`} className="px-2.5 py-[18px] text-lg text-white bg-[#036EFF] rounded-2xl">
          Assign Sub Task
        </Link>
      </div>
      <div className="mt-10">
        <SubTaskContent />
      </div>
    </div>
  );
};

export default SubTaskPage;
