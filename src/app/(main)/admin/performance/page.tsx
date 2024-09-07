"use client";
import LineChart from "@app/components/charts/LineChart";
import PieChart from "@app/components/charts/PieChart";
import TableContent from "@app/components/TableContent";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-3 py-10 gap-3">
      <div className="col-span-2">
        <LineChart />
      </div>
      <div className="col-span-1">
        <PieChart />
      </div>

      <div className="col-span-3">
        <TableContent />
      </div>
    </div>
  );
};

export default page;
