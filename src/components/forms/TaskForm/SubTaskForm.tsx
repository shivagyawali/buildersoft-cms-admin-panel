"use client";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../InputField";
import DatePickerField from "../DatePickerField";

const SubTaskForm = () => {
  return (
    <div className="bg-white py-10 px-7 rounded-2xl">
      <Formik
        initialValues={{
          title: "",
          type: "",
          startDate: "",
          endDate: "",
          description: "",
        }}
        onSubmit={(values) => {
          // TODO: API call to create subtask
          console.log("Creating subtask:", values);
        }}
      >
        <Form>
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-7">
              <div className="w-1/3">
                <InputField
                  name="title"
                  label="Sub Task Title"
                  placeholder="Sub Task Title"
                />
              </div>
              <div className="w-1/3">
                <InputField
                  name="type"
                  label="Sub Task Type"
                  placeholder="Sub Task Type"
                />
              </div>
              <div className="w-1/3 flex gap-5">
                <div className="w-1/2">
                  <DatePickerField name="startDate" label="Start Date" />
                </div>
                <div className="w-1/2">
                  <DatePickerField name="endDate" label="End Date" />
                </div>
              </div>
            </div>
            <div className="w-full">
              <InputField
                as="textarea"
                name="description"
                label="Sub Task Description"
                placeholder="Sub Task Description"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors duration-200"
              >
                Create Sub Task
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SubTaskForm;
