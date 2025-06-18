"use client";
import React from "react";
import LineChart from "@app/components/charts/LineChart";
import PieChart from "@app/components/charts/PieChart";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import BreadCrumb from "@app/components/Breadcrumb";

const page = () => {
  return (
    <>
      <BreadCrumb title="Dashboard" />
      <div className="grid grid-cols-3 py-10 gap-3">
        <div className="col-span-2">
          <LineChart />
        </div>
        <div className="col-span-1">
          <PieChart />
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-2 py-10 gap-3">
            <div className=" bg-white rounded-xl pt-8 px-8">
              <p className="text-2xl font-bold ">Upcoming Projects</p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold text-black">102</span>, upcoming
                projects this month.
              </p>
              <div className="py-8">
                <TableContent data={tasks} dashboard />
              </div>
            </div>
            <div className=" bg-white rounded-xl pt-8 px-8">
              <p className="text-2xl font-bold ">Upcoming Tasks</p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold text-black">102</span>, upcoming
                tasks this month.
              </p>
              <div className="py-8">
                <TableContent data={tasks} dashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
