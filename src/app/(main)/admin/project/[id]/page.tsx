"use client";
import LineChart from "@app/components/charts/LineChart";
import PieChart from "@app/components/charts/PieChart";
import React from "react";

const ProjectDetail = () => {
  return (
    <div>
      <p className="text-3xl text-[#0E2040]">Projects</p>

      <div className="grid grid-cols-3 py-10 gap-3">
        <div className="col-span-1">
          <PieChart />
        </div>
        <div className="col-span-2">
          <LineChart />
        </div>
        <div className="col-span-2 bg-white p-8">
          <div className="flex items-center justify-between">
         <p >Ui Developers</p>   
         <div>
         <input
            type="text"
            className="w-[328px] border border-[#9A93B3] rounded-md p-2 outline-none text-xs"
            placeholder="search for anything...."
          />
         </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
