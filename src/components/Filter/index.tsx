"use client";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../forms/InputField";
import DatePickerField from "../forms/DatePickerField";
import SelectField from "../forms/SelectField";

const Filter = () => {
  return (
    <>
      <Formik
        initialValues={{ name: "", date: "", status: "select" }}
        onSubmit={(values) => console.log(values)}
      >
        <Form className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-1/2">
            <InputField name="name" placeholder="Search by name" />
            <DatePickerField name="date" />
            <SelectField
              name="status"
              options={[
                {
                  label: "On Process",
                  value: "on_process",
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
              className="bg-blue-500 rounded-2xl text-white px-6  py-3"
            >
              Filter
            </button>
            <button
              type="reset"
              className="bg-gray-500 rounded-2xl text-white px-6 py-3"
            >
              Reset
            </button>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default Filter;
