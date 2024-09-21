import { Field } from "formik";
import React from "react";

const InputField = ({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-[#333333] text-xl">
        {label}
      </label>
      <Field
        type="text"
        name={name}
        placeholder={placeholder}
        className="border border-[#DDDDDD] py-3 px-3 outline-none rounded-2xl"
      />
    </div>
  );
};

export default InputField;
