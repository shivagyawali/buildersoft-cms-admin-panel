"use client";

import { AppDispatch } from "@app/app/redux/store";
import { getWorkLogs } from "@app/app/redux/workLogSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";

import { ArcElement, Chart } from "chart.js";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

Chart.register(ArcElement);

const AdminWorkLogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { worklogs, loading } = useSelector((state: any) => state.worklogs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getWorkLogs(currentPage));
  }, [dispatch, currentPage]);

  const totalPages = worklogs?.totalPages || 1;
  
  const mappedData = worklogs?.map((log: any) => ({
    id: log.id,
    userName: log.user?.name,
    userEmail: log.user?.email,
    avatar: log.user?.avatar,
    startTime: moment(log.startTime).format("hh:mm:ss A"),
    endTime: moment(log.endTime).format("hh:mm:ss A"),
    totalHours: log.totalHours,
    earnings: log.earnings,
    location: `${log.startLatitude}, ${log.startLongitude}`,
  }));

  const TableContentPage: React.FC<any> = ({ data, loading }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">User</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Start</th>
              <th className="p-4 text-sm font-semibold text-gray-600">End</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Hours</th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Earnings
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-6">
                  Loading work logs...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6">
                  No work logs found.
                </td>
              </tr>
            ) : (
              data.map((log: any, idx: any) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <Image
                      src={log.avatar}
                      alt={log.userName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{log.userName}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{log.userEmail}</td>
                  <td className="p-4 text-sm text-gray-700">{log.startTime}</td>
                  <td className="p-4 text-sm text-gray-700">{log.endTime}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {log.totalHours}
                  </td>
                  <td className="p-4 text-sm text-green-600 font-semibold">
                    ${log.earnings}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <div className="w-40 h-24 rounded-md overflow-hidden shadow-sm">
                      <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${log.location}&z=15&output=embed`}
                      ></iframe>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

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
            <TableContentPage data={mappedData || []} loading={loading} />
            {/* Pagination */}
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
        <div className="col-span-1 w-5/6 relative">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWorkLogPage;
