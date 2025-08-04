"use client";
import React, { useEffect } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";
import Loading from "@app/components/Loading";
import { motion } from "framer-motion";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated, role } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (!loading && isAuthenticated && role) {
      if (role === "worker") router.push("/worker/project");
      else if (["client", "root"].includes(role))
        router.push("/admin/dashboard");
    }
  }, [isAuthenticated, loading, role, router]);

  const handleSubmit = async (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    try {
      const resultAction = await dispatch(loginUser(values));
      const { user } = resultAction?.payload || {};

      if (loginUser.fulfilled.match(resultAction) && user) {
        if (user.role === "worker") router.push("/worker/project");
        else if (["client", "root"].includes(user.role))
          router.push("/admin/dashboard");
      } else {
        setErrors({ email: "Invalid email or password" });
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9)), url('/bg.jpg')`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-orange-500 to-orange-600 p-10 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg p-2">
            BuildMaster CMS
          </h1>
          <p className="text-center text-lg font-light max-w-xs">
            Powering your construction projects with ease and control.
          </p>
          <div className="mt-6 h-1 w-24 bg-white/40 rounded-full" />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10 md:p-12">
          <h2 className="text-3xl font-semibold text-gray-800 p-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-1 mb-6">
            Log in to manage your projects
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email && touched.email
                        ? "border-red-400"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password && touched.password
                        ? "border-red-400"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300`}
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-end text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="text-orange-600 hover:text-orange-700 underline underline-offset-4 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </motion.button>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
