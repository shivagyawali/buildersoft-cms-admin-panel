import { tasks } from "@app/constants/options";
import Link from "next/link";
import React from "react";

const SubTaskContent = () => {
  return (
    <div className="p-14">
      {tasks.map(
        (task) =>
          task.subTask && (
            <div
              key={task.id}
              className="pl-4 pr-10 py-6 bg-white drop-shadow-lg rounded-2xl"
            >
              <div className="flex justify-between">
                <div>
                  <Link
                    href={`/admin/tasks/${task.id}`}
                    className="text-sm font-bold"
                  >
                    {task.title}
                  </Link>
                  <div className="flex mt-1.5">
                    <div className="flex items-center text-xs gap-2">
                      <p>{task.desc}</p>
                      {/* <p>
                Opened 10 days ago by <strong>Yash Ghori</strong>
              </p> */}
                    </div>
                    <div className="ml-[74px]">
                      {/* <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                {task.formStatus}
              </p> */}
                      <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                        {task.formStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="w-fit text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                    2M : 0W : 0D
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-5 pt-12 pb-[52px] px-12">
                {task.subTask.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="pl-4 pr-10 py-6 bg-white drop-shadow-lg rounded-2xl"
                  >
                    <div key={subtask.id} className="flex justify-between">
                      <div>
                        <Link
                          href={`/admin/tasks/${subtask.id}`}
                          className="text-sm font-bold"
                        >
                          {subtask.title}
                        </Link>
                        <div className="flex mt-1.5">
                          <div className="flex items-center text-xs gap-2">
                            <p>{subtask.desc}</p>
                            {/* <p>
                Opened 10 days ago by <strong>Yash Ghori</strong>
              </p> */}
                          </div>
                          <div className="ml-[74px]">
                            {/* <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                {task.formStatus}
              </p> */}
                            <p className="w-fit text-xs text-[#4BA665] rounded-full bg-[#4BA665]/10 px-4 py-2">
                              {subtask.formStatus}
                            </p>
                          </div>
                        </div>
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
    </div>
  );
};

export default SubTaskContent;
