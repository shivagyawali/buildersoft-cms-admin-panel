"use client";

import { AppDispatch } from "@app/app/redux/store";
import { getWorkLogs } from "@app/app/redux/workLogSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import DoughnutChart from "@app/components/charts/DoughnutChart";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";

import { ArcElement, Chart } from "chart.js";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

Chart.register(ArcElement);

const AdminWorkLogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { worklogs, loading, error } = useSelector(
    (state: any) => state.worklogs
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getWorkLogs(currentPage));
  }, [dispatch, currentPage]);

  const totalPages = worklogs?.totalPages || 1;

  return (
    <>
      <BreadCrumb title="Work Logs" />
      <div className="grid grid-cols-3 gap-10 mt-6">
        {/* Table Section */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl p-8">
            <div className="mb-6">
              <Filter />
            </div>
            <TableContent data={worklogs} />
            {/* Optional Pagination */}
            <div className="mt-6 flex justify-end gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-md border ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart and Notifications */}
        <div className="col-span-1 w-5/6  relative">
          {/* <DoughnutChart work={worklogs?.items || []} /> */}

          <div className="bg-white p-8 mt-4 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Notifications</p>
              <Link
                href={"/admin/notifications"}
                className="text-sm text-[#036EFF]"
              >
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-6 max-h-72 overflow-y-auto">
              {/* Example Notification - replace with dynamic data if available */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden rounded-md">
                  <Image
                    src="/user-placeholder.jpg"
                    alt="User"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">New work log added</p>
                  <p className="text-xs text-gray-500">5 mins ago</p>
                </div>
              </div>
              {/* Repeat similar blocks for multiple notifications */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWorkLogPage;
