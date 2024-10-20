"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import PDFInvoice from "@app/components/download/PDFInvoice";
import Filter from "@app/components/Filter";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import dynamic from "next/dynamic";
import React from "react";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const Reports = () => {
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
          <Filter />
        </div>
        <TableContent data={tasks} />
      </div>
    </div>
  );
};

export default Reports;
