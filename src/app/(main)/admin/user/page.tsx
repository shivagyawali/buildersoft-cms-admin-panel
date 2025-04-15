"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <BreadCrumb title="Users">
        <Link
          href={"/admin/user/create"}
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Create User
        </Link>
      </BreadCrumb>

      <div className="bg-white rounded-2xl p-8 mt-6">
        <div className="mb-6">
          <Filter />
        </div>
        <TableContent data={tasks} />
      </div>
    </div>
  );
};

export default page;
