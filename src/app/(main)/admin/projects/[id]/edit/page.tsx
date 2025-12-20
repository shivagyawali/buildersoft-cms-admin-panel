"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch } from "@app/app/redux/store";

import ProjectForm from "@app/components/forms/ProjectForm";
import BreadCrumb from "@app/components/Breadcrumb";
import { useDispatch } from "react-redux";
import { getSingleProject } from "@app/app/redux/projectSlice";
import { useSelector } from "react-redux";

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { projects, loading, error } = useSelector(
    (state: any) => state.projects
  );

  useEffect(() => {
    if (id) {
      dispatch(getSingleProject(id));
    }
  }, [id, dispatch]);

  if (loading || !projects) {
    return <div>Loading...</div>;
  }

  if (projects.id !== id) {
    return <div>Project not found</div>;
  }

  const initialValues = {
    id: projects.id,
    name: projects.name || "",
    description: projects.description || "",
    status: projects.status || "",
  };

  return (
    <div>
      <BreadCrumb title="Edit Project" />

      <div className="mt-10">
        <ProjectForm
          mode="edit"
          initialValues={initialValues}
          onDiscard={() => router.push("/admin/projects")}
        />
      </div>
    </div>
  );
};

export default EditProject;
