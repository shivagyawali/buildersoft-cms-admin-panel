"use client";
import { AppDispatch } from "@app/app/redux/store";
import { getUsers } from "@app/app/redux/userSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import Filter from "@app/components/Filter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion"; // For animations
import { FaEye, FaEdit } from "react-icons/fa"; // Icons for actions
import Image from "next/image";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector(
    (state: { users: any }) => state.users
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getUsers(currentPage));
  }, [dispatch, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* BreadCrumb with Gradient Button */}
      <BreadCrumb title="Users">
        <div className="w-40 scale-95 text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:scale-100 transition-all duration-300 cursor-pointer">
          <Link
            href="/admin/users/create"
            className="text-lg font-semibold text-white "
          >
            Create User
          </Link>
        </div>
      </BreadCrumb>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 mt-6 shadow-xl"
      >
        <div className="mb-8">
          <Filter />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left rounded-xl shadow-md">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase text-xs font-semibold">
                <tr>
                  <th className="px-5 py-3 rounded-tl-xl">Avatar</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Rate ($/hr)</th>
                  <th className="px-5 py-3 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {users?.results?.map((user: any) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <Image
                        width={1000}
                        height={1000}
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full border-2 border-blue-100 shadow-sm"
                      />
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{user.email}</td>
                    <td className="px-5 py-3 capitalize text-gray-600">
                      {user.role}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {user.company?.name}
                    </td>
                    <td className="px-5 py-3 text-gray-800">
                      ${user.hourlyRate}
                    </td>
                    <td className="px-5 py-3 flex space-x-2">
                      <Link
                        href={`/admin/user/${user.id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/admin/users/edit/${user.id}`}
                        className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-200"
                      >
                        <FaEdit />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;
