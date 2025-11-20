'use client'
import { AppDispatch } from "@app/app/redux/store";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getTasks } from "@app/app/redux/taskSlice";
const AdminTasks = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { tasks, loading, error } = useSelector(
     (state: any) => state.tasks
   );
   const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
     dispatch(getTasks(currentPage));
   }, [dispatch, currentPage]);

   const totalPages = tasks?.totalPages || 1;
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
          {/* <Filter /> todo */}
        </div>
        <TableContent data={tasks?.results} />
      </div>
    </div>
  );
};

export default AdminTasks;
