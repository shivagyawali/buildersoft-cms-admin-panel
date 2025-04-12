"use client";
import React from "react";
import { Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import loginImge from "@app/assets/images/login-img.svg";
import { loginUser } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) router.push("/admin/project");
  }, [isAuthenticated, router]);

  return (
    <div className="px-28 py-10">
      <p className="text-2xl font-bold">BuilderSoft CMS</p>
      <div className="flex items-center justify-between">
        {/* Login Image */}
        <div className="w-1/3 mt-16">
          <Image
            src={loginImge}
            alt="Login"
            width={500}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* Login Form */}
        <div className="w-1/3 mr-28">
          <p className="text-4xl font-black">Welcome!</p>
          <p className="text-xl font-thin mt-3">
            Welcome! Please enter your details.
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values:any, { setSubmitting, setErrors }) => {
              try {
                const resultAction =  dispatch(loginUser(values));

                if (loginUser.fulfilled.match(resultAction)) {
                  router.push("/admin/project"); // Redirect on success
                } else {
                  setErrors({ email: "Invalid credentials" }); // Show error
                }
              } catch (error) {
                console.error("Login error:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
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

                {/* Terms & Forgot Password */}
                <div className="flex items-center justify-between mt-6">
                  <label className="flex items-center">
                    <Field
                      name="termsAndConditions"
                      type="checkbox"
                      className="mr-2"
                    />
                    <span className="font-thin">Terms & Conditions</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="font-thin underline underline-offset-2"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                {/* Submit Button */}
                <div className="mt-9">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="text-white rounded-md font-bold bg-black w-full py-5 disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </button>

                  <p className="mt-[38px] text-center font-thin">
                    Don&apos;t have an account?{" "}
                    <span className="font-medium">
                      <Link
                        href="/auth/register"
                        className="underline underline-offset-2"
                      >
                        Sign up for free
                      </Link>
                    </span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


