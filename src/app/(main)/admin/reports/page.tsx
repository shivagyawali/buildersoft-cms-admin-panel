"use client";
import PDFInvoice from "@app/components/download/PDFInvoice";
import TableContent from "@app/components/TableContent";
import { tasks } from "@app/constants/options";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";

const Reports = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-[#9A93B3] text-xl font-semibold">Report</p>
        <PDFDownloadLink
          document={<PDFInvoice />}
          fileName="invoice"
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Download
        </PDFDownloadLink>
      </div>
      <TableContent data={tasks} />
    </div>
  );
};

export default Reports;
