import {
  FgDocumentIcon,
  FgEditIcon,
  FgSandGlassIcon,
} from "@app/constants/SVGCollection";
import Link from "next/link";
import React from "react";

const AdminProject = () => {
    
  return (
    <div>
      <div className="flex items-center justify-between mb-11">
        <p className="text-3xl text-[#0E2040]">Projects</p>
        <Link href={"/admin/project/create"} className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl">
          Create
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-12">
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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

        {/* --------------------------------------------------------- */}
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
        <div className="bg-white rounded-2xl px-4 py-6">
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
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
    </div>
  );
};

export default AdminProject;
