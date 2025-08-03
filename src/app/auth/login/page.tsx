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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated,role } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (!loading && isAuthenticated) {
     if(role == 'worker'){
        router.push("/worker/dashboard");
     }

     
     if(role=='company' || role =='root'){
       router.push("/admin/dashboard");
     }
    }
  }, [isAuthenticated, loading,role, router]);

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #4B5563 0%, #374151 50%, #1F2937 100%)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        // backgroundImage: 'url(/concrete-texture.jpg)',
        // backgroundBlendMode: 'overlay'
      }}
    >
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Section - Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-orange-500 to-orange-600 p-8 flex flex-col justify-center items-center text-white overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight truncate max-w-full">
            BuildMaster CMS
          </h1>
          <p className="mt-4 text-base md:text-md font-light text-center max-w-xs md:max-w-sm truncate">
            Powering your construction projects with ease.
          </p>
          <div className="mt-6 h-1 w-20 bg-white/30 rounded-full" />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base truncate">
            Log in to manage your projects.
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                const resultAction = await dispatch(loginUser(values));
                if (loginUser.fulfilled.match(resultAction)) {
                  router.push("/admin/dashboard");
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
              <Form className="mt-8 space-y-6">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full py-3 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all duration-300"
                >
                  {loading || isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
