"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import ProjectContent from "@app/components/ProjectContent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminProject = () => {
  const route = useRouter();
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <BreadCrumb title="Projects">
          <Link
            href={"/admin/project/create"}
            className="px-6 py-3 text-lg text-white bg-[#036EFF] rounded-2xl"
          >
            Create
          </Link>
        </BreadCrumb>
      </div>
      <div className="bg-white p-8 rounded-2xl mt-6">
        <div className="pb-5">
          <Filter />
        </div>
        <ProjectContent />
      </div>
    </>
  );
};

export default AdminProject;
