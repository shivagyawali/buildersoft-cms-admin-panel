"use client";

import React, { useMemo } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Select from "react-select";

interface Task {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  project?: {
    name?: string;
    status?: string;
  };
  company?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  createdAt?: string;
}

interface TableContentProps {
  data: Task[];
}

const getCompanyUsers = (companyId: string) => [
  { id: "1", name: "John Doe", email: "john@company.com", role: "Developer" },
  { id: "2", name: "Jane Smith", email: "jane@company.com", role: "Designer" },
  {
    id: "3",
    name: "Mike Johnson",
    email: "manager@company.com",
    role: "Manager",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@company.com",
    role: "Developer",
  },
];

const getUserOptions = (companyId?: string) => {
  if (!companyId) return [];

  return getCompanyUsers(companyId).map((user) => ({
    value: user.id,
    label: user.name,
    role: user.role,
    email: user.email,
  }));
};
const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: 32,
    fontSize: "13px",
    backgroundColor: "#f9fafb",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const TableContent: React.FC<TableContentProps> = ({ data }) => {
  const handleUserSelect = (taskId: string, option: any) => {
    if (option) {
      console.log(`Assigned ${option.label} to task ${taskId}`);
    }
  };

  const columnHelper = createColumnHelper<Task>();

  const columns = useMemo(
    () => [
      // Work Item
      columnHelper.accessor((row) => row, {
        id: "task",
        header: "Work Item",
        cell: ({ getValue }) => {
          const task = getValue();
          return (
            <div>
              <Link
                href={`/admin/tasks/${task.id}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {task.title || task.name}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {task.description || "No description"}
              </p>
            </div>
          );
        },
      }),

      // Project / Phase
      columnHelper.accessor((row) => row.project, {
        id: "project",
        header: "Project / Phase",
        cell: ({ getValue }) => {
          const project = getValue();
          if (!project) return "—";

          return (
            <div>
              <p className="text-sm font-medium text-gray-800">
                {project.name || "—"}
              </p>
              <span
                className={`inline-flex items-center gap-1 mt-1 text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide ${
                  project.status === "INPROGRESS"
                    ? "bg-yellow-100 text-yellow-800"
                    : project.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                {project.status || "UNKNOWN"}
              </span>
            </div>
          );
        },
      }),

      // Contractor
      columnHelper.accessor((row) => row.company, {
        id: "company",
        header: "Contractor",
        cell: ({ getValue }) => {
          const company = getValue();
          if (!company) return "—";

          return (
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {company.name}
              </p>
              <p className="text-xs text-gray-500">{company.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase font-semibold bg-gray-100 px-2 py-0.5 rounded">
                {company.role}
              </span>
            </div>
          );
        },
      }),

      // Logged
      columnHelper.accessor("createdAt", {
        header: "Logged",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return "—";

          return formatDistanceToNow(new Date(value), {
            addSuffix: true,
          });
        },
      }),

      // Workforce
      columnHelper.accessor((row) => row, {
        id: "assign",
        header: "Workforce",
        cell: ({ getValue }) => {
          const task = getValue();
          return task.company?.id ? (
            <Select
              options={getUserOptions(task.company?.id)}
              onChange={(option) => handleUserSelect(task.id, option)}
              placeholder="Assign worker"
              isClearable
              styles={{
                ...selectStyles,
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              formatOptionLabel={(option: any) => (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-xs text-gray-500">
                    {option.role} • {option.email}
                  </span>
                </div>
              )}
            />
          ) : (
            <span className="text-xs text-gray-400">No contractor</span>
          );
        },
      }),

      // Action
      columnHelper.accessor("id", {
        header: "",
        cell: ({ getValue }) => (
          <Link
            href={`/admin/tasks/${getValue()}`}
            className="inline-flex justify-center items-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
          >
            View
          </Link>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-700 uppercase tracking-wider border-b">
        {table.getHeaderGroups().map((hg) =>
          hg.headers.map((header) => (
            <div
              key={header.id}
              className="col-span-2 px-4 border-r last:border-r-0 border-gray-200"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))
        )}
      </div>

      {/* Rows */}
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-1 md:grid-cols-12 px-6 py-3 bg-white border-b hover:bg-gray-50 transition"
        >
          {row.getVisibleCells().map((cell) => (
            <div
              key={cell.id}
              className="col-span-2 px-4 border-r last:border-r-0 border-gray-100"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableContent;
