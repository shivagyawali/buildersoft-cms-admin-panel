'use client'
import BreadCrumb from "@app/components/Breadcrumb";
import Filter, { FilterValues } from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import Link from "next/link";
import React, { useState } from "react";

const CompanyPage = () => {
  const [filteredData, setFilteredData] = useState(tasks);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter submission
  const handleFilter = (filters: Partial<FilterValues>) => {
    setIsLoading(true);
    // Filter tasks based on criteria
    let filtered = tasks;
    
    if (filters.name) {
      filtered = filtered.filter((task: any) => 
        task.company?.name?.toLowerCase().includes(filters.name!.toLowerCase())
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
      <BreadCrumb title="Companies">
        <Link
          href={"/admin/project/create"}
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Create
        </Link>
      </BreadCrumb>

      <div className="bg-white p-8 rounded-2xl mt-6">
        <div className="pb-6">
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

export default CompanyPage;
