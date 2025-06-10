"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { getProjects } from "@app/app/redux/projectSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import ProjectContent from "@app/components/ProjectContent";
import Pagination from "@app/components/Pagination";
import Link from "next/link";

const AdminProject = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects,loading,error } = useSelector((state: any) => state.projects);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProjects(currentPage));
  }, [dispatch, currentPage]);

  const totalPages = projects?.totalPages || 1;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <BreadCrumb title="Projects">
          <Link
            href="/admin/project/create"
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
        <ProjectContent projects={projects?.results} loading={loading} error={error}/>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default AdminProject;
