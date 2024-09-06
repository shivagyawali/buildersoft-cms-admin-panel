"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import loginImge from "@app/assets/images/login-img.png";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const route = useRouter();

  const handleSubmit = (values: any) => {
    route.push("/admin/project");
  };
  return (
    <div className="px-28 py-10">
      <p className="text-2xl font-bold">Construction v2</p>
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <Image src={loginImge} alt="" className="w-full object-cover" />
        </div>
        <div className="w-1/3 mr-28">
          <div>
            <p className="text-4xl font-black">Welcome!</p>
            <p className="text-xl font-thin mt-3">
              Welcome! Please enter your details.
            </p>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values) => handleSubmit(values)}
            >
              <Form className="mt-10 w-full">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full border-b border-[#A69999] py-2.5 outline-none mb-[30px]"
                />
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-[#A69999] py-2.5 outline-none"
                />
                <div className="flex items-center justify-between mt-6">
                  <label
                    htmlFor="termsAndConditions"
                    className="flex items-center"
                  >
                    <Field
                      name="termsAndConditions"
                      type="checkbox"
                      className="mr-2"
                    />
                    <span className="font-thin">Terms & Conditions </span>
                  </label>
                  <Link
                    href={"/auth/forgot-password"}
                    className="font-thin underline underline-offset-2"
                  >
                    Forgot Password ?
                  </Link>
                </div>
                <div className="mt-9">
                  <button
                    type="submit"
                    className="text-white rounded-md font-bold bg-black w-full py-5"
                  >
                    Log in
                  </button>
                  <p className="mt-[38px] text-center font-thin">
                    Don&apos;t have an account ?{" "}
                    <span className="font-medium">
                      <Link
                        href={"/auth/register"}
                        className="underline underline-offset-2"
                      >
                        Sign up for free
                      </Link>
                    </span>
                  </p>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
