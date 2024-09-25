import { permissions } from "@app/constants/options";
import React from "react";

const AdminPermission = ({ children }: any) => {
  return (
    <>
      <p className="text-[#9A93B3] text-xl font-semibold">Permissions</p>
      <div className=" bg-white rounded-lg shadow-lg my-6">
        <table className="w-full table-auto">
          <thead className="text-left">
            <tr>
              <th className="w-1/2 pl-6 py-3">Actions</th>
              <th>User</th>
              <th>Client</th>
              <th>Admin</th>
              <th className="pr-6">Root</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, index) => (
              <React.Fragment key={index}>
                <tr className=" bg-gray-100">
                  <td className="py-4 px-6">{permission.heading}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {permission.child.map((child, index) => (
                  <tr key={index} className="text-gray-500 text-left">
                    <td className="py-2 px-6">{child.label}</td>

                    <td className="px-2">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2">
                      <input type="checkbox" />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPermission;
