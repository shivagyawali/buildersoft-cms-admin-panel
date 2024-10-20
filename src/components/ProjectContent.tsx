import {
  FgDocumentIcon,
  FgEditIcon,
  FgSandGlassIcon,
} from "@app/constants/SVGCollection";
import { useRouter } from "next/navigation";
import React from "react";

const ProjectContent = () => {
  const route = useRouter();

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-12">
      <div
        className="border rounded-2xl px-4 py-6 cursor-pointer"
        onClick={() => {
          route.push("/admin/project/1");
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <div className="flex items-center gap-3">
            <p className="text-black text-2xl">Adoddle</p>
            <FgEditIcon />
          </div>
          <p className="px-4 py-2.5 text-xs text-[#BD1E1E] bg-[#C28383]/20 rounded">
            OffTrack
          </p>
        </div>
        <div className="mt-[30px] mb-12 text-xs text-[#424242]">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <FgSandGlassIcon />
            <p className="text-sm text-[#D62222]">05 APRIL 2023</p>
          </div>
          <div className="flex items-center gap-1">
            <FgDocumentIcon />
            <p className="text-sm text-[#5C5967]">14 issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContent;
