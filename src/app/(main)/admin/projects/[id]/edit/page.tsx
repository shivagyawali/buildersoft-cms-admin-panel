"use client";

import ProjectForm from "@app/components/forms/ProjectForm";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BreadCrumb from "@app/components/Breadcrumb";

const EditProject = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const name = searchParams.get("name") || "";
  const description = searchParams.get("description") || "";

  const initialValues = {
    name: decodeURIComponent(name),
    description: decodeURIComponent(description),
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
