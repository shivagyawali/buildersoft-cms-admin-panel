"use client";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../forms/InputField";

export interface UserFilterValues {
  name?: string;
  email?: string;
}

interface UserFilterProps {
  onFilter: (filters: Partial<UserFilterValues>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const UserFilter: React.FC<UserFilterProps> = ({ onFilter, onReset, isLoading = false }) => {
  return (
    <>
      <Formik
        initialValues={{ name: "", email: "" }}
        onSubmit={(values) => {
          const filters = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== "")
          );
          onFilter(filters);
        }}
      >
        {({ resetForm }) => (
          <Form className="flex items-center justify-between">
            <div className="flex items-center gap-4 w-1/2">
              <InputField name="name" placeholder="Search by name" />
              <InputField name="email" placeholder="Search by email" />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 rounded-2xl text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-200"
              >
                {isLoading ? "Filtering..." : "Filter"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onReset();
                }}
                disabled={isLoading}
                className="bg-gray-500 rounded-2xl text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserFilter;
