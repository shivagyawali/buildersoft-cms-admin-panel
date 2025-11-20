"use client";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { createProject } from "@app/app/redux/projectSlice";
import InputField from "./InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CreateProject from "@app/app/(main)/admin/projects/create/page";

interface ProjectFormValues {
  name: string;
  description: string;
}

const ProjectForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: any) => state.projects);

  const handleCreateProject = async (values: ProjectFormValues) => {
    const resultAction = await dispatch(createProject(values));
    if (createProject.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      router.push("/admin/projects");
    } else {
      toast.error(
        (resultAction.payload as string) || "Failed to create project"
      );
    }
  };

  return (
    <div className="bg-white py-10 px-7 rounded-2xl">
      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        onSubmit={(values) => handleCreateProject(values)}
      >
        <Form>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col lg:flex-row items-start gap-7">
              <div className="w-full">
                <InputField
                  name="name"
                  label="Project name"
                  placeholder="Project name"
                />
              </div>
              {/* <div className="w-full lg:w-1/3">
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
                </div> */}
            </div>
            <div className="w-full">
              <InputField
                as="textarea"
                name="description"
                label="Project Description"
                placeholder="Project Description"
                rows={5}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-2xl disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ProjectForm;
