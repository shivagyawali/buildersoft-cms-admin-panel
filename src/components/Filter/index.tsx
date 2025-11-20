"use client";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../forms/InputField";
import DatePickerField from "../forms/DatePickerField";
import SelectField from "../forms/SelectField";

export interface FilterValues {
  name?: string;
  date?: string;
  status?: string;
}

interface FilterProps {
  onFilter: (filters: Partial<FilterValues>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const Filter: React.FC<FilterProps> = ({ onFilter, onReset, isLoading = false }) => {
  return (
    <>
      <Formik
        initialValues={{ name: "", date: "", status: "" }}
        onSubmit={(values) => {
          const filters = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== "" && v !== "select")
          );
          onFilter(filters);
        }}
      >
        {({ resetForm }) => (
          <Form className="flex items-center justify-between">
            <div className="flex items-center gap-4 w-1/2">
              <InputField name="name" placeholder="Search by name" />
              <DatePickerField name="date" />
              <SelectField
                name="status"
                options={[
                  {
                    label: "Select Status",
                    value: "",
                  },
                  {
                    label: "In Process",
                    value: "In_Process",
                  },
                  {
                    label: "Completed",
                    value: "completed",
                  },
                  {
                    label: "On Hold",
                    value: "on_hold",
                  },
                  {
                    label: "Cancelled",
                    value: "cancelled",
                  },
                ]}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 rounded-2xl text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-gray-500 rounded-2xl text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Filter;
