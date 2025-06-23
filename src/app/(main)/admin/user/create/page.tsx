"use client";
import React from "react";
import { Form, Formik } from "formik";
import TextInputField from "@app/components/forms/InputField";
import SelectField from "@app/components/forms/SelectField";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { createUser } from "@app/app/redux/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const CreateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleUserSubmission = async (
    values: UserType,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const payload = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      role: values.role,
    };
    try {
      const resultAction = await dispatch(createUser(payload));
      if (createUser.fulfilled.match(resultAction)) {
        toast.success("User Created Successfully");
        router.push("/admin/user");
        resetForm();
      } else {
        toast.error(`${resultAction.payload}`);
      }
    } catch (err) {
      console.log("User Creation Error:", err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <p className="text-3xl text-[#0E2040]">Create a User</p>
      <div className="mt-10 bg-white p-10 rounded-lg">
        <Formik
          initialValues={{ firstName: "", lastName: "", email: "", role: "" }}
          onSubmit={(values, { resetForm, setSubmitting }) =>
            handleUserSubmission(values, resetForm, setSubmitting)
          }
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-10">
                  <TextInputField
                    name="firstName"
                    label="First Name"
                    placeholder="Enter User's First Name"
                  />
                  <TextInputField
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter User's Last Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <TextInputField
                    name="email"
                    label="Email"
                    placeholder="Enter User's Email Address"
                  />
                  <SelectField
                    name="role"
                    label="Role"
                    options={[
                      {
                        label: "User",
                        value: "User",
                      },
                      {
                        label: "Worker",
                        value: "Worker",
                      },
                      {
                        label: "Admin",
                        value: "Admin",
                      },
                    ]}
                  />
                </div>
                {/* 
              <div className="grid grid-cols-2 gap-10">
                <TextInputField
                  name="password"
                  label="Password"
                  placeholder="Enter User's Password"
                />
                <TextInputField
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Enter User's Password"
                />
              </div> */}
              </div>
              <div className="w-full text-right pt-10">
                <button
                  className={
                    "px-4 py-3 bg-blue-500 text-white rounded-xl disabled:bg-gray-300 disabled:text-black"
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting" : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateUser;
