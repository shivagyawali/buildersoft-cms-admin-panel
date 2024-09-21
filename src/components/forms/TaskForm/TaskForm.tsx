"use client";
import { Form, Formik } from "formik";
import React from "react";
import TextInputField from "../InputField";
import DatePickerField from "../DatePickerField";
import SelectField from "../SelectField";
import { taskAssignedTo } from "@app/constants/menu-items/rootIndex";

const TaskForm = () => {
  return (
    <div className="bg-white py-10 px-7 rounded-2xl">
      <Formik
        initialValues={{ taskTitle: "", taskType: "" }}
        onSubmit={(values) => console.log(values)}
      >
        <Form>
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-7">
              <div className="w-1/3">
                <TextInputField
                  name="title"
                  label="Task Title"
                  placeholder="Task Title"
                />
              </div>
              <div className="w-1/3">
                <TextInputField
                  name="type"
                  label="Task Type"
                  placeholder="task Type"
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
              <TextInputField
                name="title"
                label="Task Description"
                placeholder="Task Description"
              />
            </div>
            <div className="w-1/3">
              <SelectField
                name="assignTo"
                label="Assign To"
                options={taskAssignedTo}
              />
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default TaskForm;
