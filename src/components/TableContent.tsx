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
    <div className={dashboard ? "p-1 mt-6" : "p-8"}>
      {data &&
        data.map((task: any, idx: number) => (
          <div
            className="px-4 py-6 mb-6 bg-white drop-shadow-lg rounded-2xl"
            key={idx}
          >
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex-1">
                <Link
                  href={`/admin/tasks/${task.id}`}
                  className="text-sm font-bold hover:text-gray-600"
                >
                  {task.title}
                </Link>
                <div className="mt-1.5 flex items-center gap-5">
                  <p className="text-xs">{task.desc}</p>
                  <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                    {task.formStatus}
                  </p>
                </div>
              </div>
              {!dashboard && (
                <div className=" w-fit rounded-full bg-[#4BA665]/10 px-4 py-2">
                  <p className="text-[#4BA665]">
                    2M : 0W : 0D
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TableContent;
