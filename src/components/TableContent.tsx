import Link from "next/link";
import React from "react";

const TableContent = ({
  dashboard,
  data,
}: {
  dashboard?: boolean;
  data: any;
}) => {
  return (
    <div>
      <div className="px-4 py-2 mb-2 bg-white border rounded-2xl">
        <div className="flex items-center justify-between">
         <p>Name</p> 
         <p>Status</p> 
         <p>Assigned To</p> 
         <p>Action</p> 
        </div>
      </div>
      {data &&
        data.map((task: any, idx: number) => (
          <div className="px-4 py-2 mb-2 bg-white border rounded-2xl" key={idx}>
            <div className="flex items-center justify-between">
              <div className="flex-1 flex items-center gap-4">
                <Link
                  href={`/admin/tasks/${task.id}`}
                  className="text-sm font-semibold hover:text-gray-600"
                >
                  {task.title}
                </Link>
                <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                  {task.formStatus}
                </p>
              </div>
              {!dashboard && (
                <div className="w-fit rounded-full bg-[#4BA665]/10 px-4 py-2">
                  <p className="text-[#4BA665]">2M : 0W : 0D</p>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TableContent;
