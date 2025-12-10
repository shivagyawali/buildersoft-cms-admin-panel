"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import PDFInvoice from "@app/components/download/PDFInvoice";
import Filter, { FilterValues } from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const Reports = () => {
  const [filteredData, setFilteredData] = useState(tasks);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter submission
  const handleFilter = (filters: Partial<FilterValues>) => {
    setIsLoading(true);
    // Filter tasks based on criteria
    let filtered = tasks;
    
    if (filters.name) {
      filtered = filtered.filter((task: any) => 
        task.title?.toLowerCase().includes(filters.name!.toLowerCase()) ||
        task.name?.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter((task: any) => 
        task.status?.toLowerCase() === filters.status!.toLowerCase()
      );
    }
    
    setFilteredData(filtered);
    setIsLoading(false);
  };

  // Handle reset
  const handleReset = () => {
    setFilteredData(tasks);
  };
  return (
    <div>
      <BreadCrumb title="Reports">
        {" "}
        <PDFDownloadLink
          document={<PDFInvoice />}
          fileName="invoice"
          className="px-6 py-3 text-white bg-[#036EFF] rounded-2xl"
        >
          Download
        </PDFDownloadLink>
      </BreadCrumb>
    
      <div className="bg-white p-8 rounded-2xl mt-6">
        <div className="pb-5">
          <Filter 
            onFilter={handleFilter}
            onReset={handleReset}
            isLoading={isLoading}
          />
        </div>
        <TableContent data={filteredData} />
      </div>
    </div>
  );
};

export default Reports;
