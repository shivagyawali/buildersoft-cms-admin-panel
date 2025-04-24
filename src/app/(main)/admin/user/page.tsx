"use client";
import { AppDispatch } from "@app/app/redux/store";
import { getUsers } from "@app/app/redux/userSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
   const { users, loading } = useSelector(
      (state: { users: any}) => state.users
    );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getUsers(currentPage));
  }, [dispatch, currentPage]);

  

  return (
    <div>
      <BreadCrumb title="Users">
        <Link
          href="/admin/user/create"
          className="px-[20px] py-[8px] text-lg text-white bg-[#036EFF] rounded-2xl"
        >
          Create User
        </Link>
      </BreadCrumb>

      <div className="bg-white rounded-2xl p-8 mt-6">
        <div className="mb-6">
          <Filter />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading users...
          </div>
        )  : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left rounded-xl overflow-hidden shadow-md">
              <thead className="bg-[#036EFF] text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Avatar</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Rate ($/hr)</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {users?.results?.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.company?.name}</td>
                    <td className="px-6 py-4">${user.hourlyRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
