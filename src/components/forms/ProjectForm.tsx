"use client";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { createProject } from "@app/app/redux/projectSlice";
import DatePickerField from "./DatePickerField";
import InputField from "./InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { unwrapResult } from "@reduxjs/toolkit";

const ProjectForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: any) => state.projects);

  return (
    <div className="bg-white py-10 px-7 rounded-2xl">
      <Formik
        initialValues={{
          name: "",
          type: "",
          description: "",
          startDate: "",
          endDate: "",
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          const resultAction = await dispatch(createProject(values));
          try {
            if (createProject.fulfilled.match(resultAction)) {
              toast.success("Project Created Successfully.");
              router.push("/admin/project");
              resetForm();
            } else {
              toast.error(`${resultAction.payload}`);
            }
          } catch (err) {
            console.log("Project Creation Error:", err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row items-start gap-7">
                <div className="w-full lg:w-1/3">
                  <InputField
                    name="name"
                    label="Project name"
                    placeholder="Project name"
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <InputField
                    name="type"
                    label="Project Type"
                    placeholder="Project Type"
                  />
                </div>
                <div className="w-full lg:w-1/3 flex gap-5">
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
                  label="Project Description"
                  placeholder="Project Description"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl disabled:opacity-50"
                  disabled={loading}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProjectForm;
