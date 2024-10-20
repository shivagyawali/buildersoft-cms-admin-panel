import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const SubTaskContent = () => {
  return (
    <>
      {tasks.map(
        (task) =>
          task.subTask && (
            <div
              key={task.id}
              className="pl-4 pr-10 py-6 bg-white rounded-2xl"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/tasks/${task.id}`}
                    className="text-xl font-bold"
                  >
                    {task.title}
                  </Link>

                  <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                    {task.formStatus}
                  </p>
                </div>
                <div>
                  <p className="w-fit text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                    2M : 0W : 0D
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4 px-12">
                {task.subTask.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="pl-4 pr-10 py-3 bg-white border rounded-2xl"
                  >
                    <div key={subtask.id} className="flex justify-between">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/tasks/${subtask.id}`}
                          className="text-sm font-bold"
                        >
                          {subtask.title}
                        </Link>
                      
                          
                            <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                              {subtask.formStatus}
                            </p>
                        
                      </div>
                      <div>
                        <p className="w-fit text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                          2M : 0W : 0D
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </>
  );
};

export default SubTaskContent;
