"use client";
import React, { useEffect } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import loginImage from "@app/assets/images/login-img.svg";
import { loginUser } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";
import Loading from "@app/components/Loading";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/admin/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <Loading />;

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <p className="text-2xl font-bold">BuilderSoft CMS</p>
        <div className="w-full flex items-center justify-center gap-8">
          {/* Login Image */}
          <div className="w-1/2">
            <Image
              src={loginImage}
              alt="Login"
              width={500}
              height={500}
              className="w-full object-cover"
            />
          </div>

          {/* Login Form */}
          <div className="w-full flex-1">
            <p className="text-4xl font-black">Welcome!</p>
            <p className="text-xl font-thin mt-3">
              Please enter your credentials below.
            </p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  const resultAction = await dispatch(loginUser(values));
                  if (loginUser.fulfilled.match(resultAction)) {
                    router.push("/admin/");
                  } else {
                    setErrors({ email: "Invalid credentials" });
                  }
                } catch (err) {
                  console.error("Login error:", err);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="mt-10 w-full">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full border-b border-[#A69999] py-2.5 outline-none mb-[10px]"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mb-3">{errors.email}</p>
                  )}

                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full border-b border-[#A69999] py-2.5 outline-none"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.password}
                    </p>
                  )}

                  {/* Forgot Password */}
                  <div className="flex items-center justify-between mt-6">
                    <span></span> {/* Empty span to align right */}
                    <Link
                      href="/auth/forgot-password"
                      className="font-thin underline underline-offset-2"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Backend Error */}
                  {error && (
                    <p className="text-red-500 text-sm mt-3">{error}</p>
                  )}

                  {/* Submit Button */}
                  <div className="mt-9">
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="text-white rounded-md font-bold bg-black w-full py-5 disabled:opacity-50"
                    >
                      {loading || isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
