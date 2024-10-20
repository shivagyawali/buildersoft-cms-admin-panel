import BreadCrumb from "@app/components/Breadcrumb";
import TaskForm from "@app/components/forms/TaskForm/TaskForm";
import React from "react";

const CreateTask = () => {
  return (
    <div>
      <BreadCrumb title="Create Task" />
      <div className="mt-10">
        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTask;
