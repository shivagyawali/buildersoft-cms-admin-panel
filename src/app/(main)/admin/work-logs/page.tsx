"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import DoughnutChart from "@app/components/charts/DoughnutChart";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import { ArcElement, Chart } from "chart.js";
import Image from "next/image";
import Link from "next/link";
import React from "react";

Chart.register(ArcElement);

const AdminWorkLogPage = () => {
  return (
    <>
      <BreadCrumb title="Work Logs"></BreadCrumb>
      <div className="grid grid-cols-3 gap-10 mt-6">
        <div className="col-span-2">
          <div className="bg-white rounded-2xl p-8">
            <div className="mb-6">
              <Filter />
            </div>
            <TableContent data={tasks} />
          </div>
        </div>
        <div className="col-span-1 relative">
          <DoughnutChart work />

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

            <div className="flex flex-col gap-2 mt-8">
              <div className="flex items-center gap-3 ">
                <div className="w-12 h-12 overflow-hidden rounded-md">
                  <Image
                    src={
                      "data:image/jpeg;base64,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"
                    }
                    alt=""
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-normal">Ellie joined team developers</p>
                  <p className="text-gray-500 font-thin mt-1 ">
                    04 April, 2021 | 04:00 PM
                  </p>
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
