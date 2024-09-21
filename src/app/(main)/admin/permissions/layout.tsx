"use client";
import { roleTab } from "@app/constants/options";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

const PermissionLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
      <div className="mb-11">
        <p className="text-3xl">Permissions</p>
      </div>
      <div className="flex items-start justify-start gap-10 mb-11 bg-white rounded-xl">
        <div className="border-b">
          {roleTab.map((role, index) => (
            <Link
              href={role.path}
              className={`inline-block cursor-pointer hover:border-b-4 px-4 py-6
                ${pathname === role.path ? "border-b border-b-black" : ""}`}
              key={index}
            >
              {role.name}
            </Link>
          ))}
        </div>
      </div>
      <div className=" p-6 bg-white rounded-xl">{children}</div>
    </>
  );
};

export default PermissionLayout;
