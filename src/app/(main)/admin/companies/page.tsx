'use client'
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const CompanyPage = () => {
  return (
    <div>
      <BreadCrumb title="Companies">
        <Link
          href={"/admin/project/create"}
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Create
        </Link>
      </BreadCrumb>

      <div className="bg-white p-8 rounded-2xl mt-6">
        <div className="pb-6">
          {/* <Filter /> todo */}
        </div>
        <TableContent data={tasks} />
      </div>
    </div>
  );
};

export default CompanyPage;
