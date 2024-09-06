"use client";

import ProjectContent from "@app/components/ProjectContent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const AdminProject = () => {
  const route = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between mb-11">
        <p className="text-3xl text-[#0E2040]">Projects</p>
        <Link href={"/admin/project/create"} className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl">
          Create
        </Link>
      </div>
      
    <ProjectContent />
    </div>
  );
};

export default AdminProject;
