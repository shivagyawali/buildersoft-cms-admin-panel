import ProjectForm from "@app/components/forms/ProjectForm";
import React from "react";

const CreateProject = () => {
  return (
    <div>
      <p className="text-[#9A93B3] text-2xl">
        Projects / Create Projects
      </p>
      <div className="mt-10">
        <ProjectForm />
      </div>
    </div>
  );
};
export default CreateProject;
