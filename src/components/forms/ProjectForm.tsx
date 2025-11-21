"use client";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { createProject } from "@app/app/redux/projectSlice";
import InputField from "./InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProjectFormValues {
  name: string;
  description: string;
}

interface ProjectFormProps {
  mode?: "create" | "edit";
  initialValues?: ProjectFormValues;
  projectId?: string;
  onDiscard?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode = "create",
  initialValues,
  projectId,
  onDiscard,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: any) => state.projects);

  const defaultInitialValues: ProjectFormValues = {
    name: "",
    description: "",
  };

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

  const handleUpdateProject = async (values: ProjectFormValues) => {
    // TODO: API integration
    toast.success("Project updated successfully!");
    router.push("/admin/projects");
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    if (mode === "edit") {
      await handleUpdateProject(values);
    } else {
      await handleCreateProject(values);
    }
  };

  const handleDiscardChanges = () => {
    if (onDiscard) {
      onDiscard();
    } else {
      router.push("/admin/projects");
    }
  };

  return (
    <div className="bg-white py-10 px-7 rounded-2xl">
      <Formik
        initialValues={initialValues || defaultInitialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ resetForm }) => (
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
              <div className="flex justify-end gap-4">
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={handleDiscardChanges}
                    className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors"
                  >
                    Discard
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl disabled:opacity-50 hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading
                    ? mode === "edit"
                      ? "Updating..."
                      : "Creating..."
                    : mode === "edit"
                    ? "Update"
                    : "Create"}
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
