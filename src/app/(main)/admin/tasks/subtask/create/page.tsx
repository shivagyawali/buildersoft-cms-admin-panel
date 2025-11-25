import BreadCrumb from "@app/components/Breadcrumb";
import SubTaskForm from "@app/components/forms/TaskForm/SubTaskForm";
import React from "react";

const CreateSubTaskPage = () => {
  return (
    <div>
      <BreadCrumb title="Create Sub Task" />
      <div className="mt-10">
        <SubTaskForm />
      </div>
    </div>
  );
};

export default CreateSubTaskPage;
