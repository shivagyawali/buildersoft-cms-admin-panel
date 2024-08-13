import { Field } from "formik";
import React from "react";

const SelectField = ({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: any;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-[#333333] text-xl">
        {label}
      </label>
      <Field name={name} as="select" defaultValue="select" className="border border-[#DDDDDD] py-3 px-3 outline-none rounded-2xl">
      <option value="select" disabled>
           Please Select
          </option>
        {options.map((item: any) => (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default SelectField;
