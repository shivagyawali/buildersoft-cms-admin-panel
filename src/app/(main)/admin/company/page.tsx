import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const CompanyPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-11">
        <p className="text-3xl text-[#0E2040]">Company List</p>
        <Link
          href={"/admin/project/create"}
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Create
        </Link>
      </div>
      <TableContent data={tasks} />
    </div>
  );
};

export default CompanyPage;
