"use client";
import Image from "next/image";
import React from "react";
import loginImge from "@app/assets/images/login-img.svg";
import { Field, Form, Formik } from "formik";
import Link from "next/link";

const RegisterPage = () => {
  const handleSubmit = () => {
    window.location.href = "admin/project";
  };
  return (
    <div className="px-28 py-10">
      <p className="text-2xl font-bold">BuilderSoft CMS</p>
      <div className="flex items-center justify-between">
        <div className="w-1/3 mt-16">
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
              onSubmit={handleSubmit}
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
                  className="w-full border-b border-[#A69999] py-2.5 outline-none mb-[30px]"
                />
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border-b border-[#A69999] py-2.5 outline-none"
                />

                <div className="mt-9">
                  <button
                    type="submit"
                    className="text-white rounded-md font-bold bg-black w-full py-5"
                  >
                    Sign Up
                  </button>
                  <p className="mt-[38px] text-center font-thin">
                    Already have an account ?{" "}
                    <span className="font-medium">
                      <Link
                        href={"/auth/login"}
                        className="underline underline-offset-2"
                      >
                        Login
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

export default RegisterPage;
