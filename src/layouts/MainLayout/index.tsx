"use client";
import React, { useEffect } from "react";
import Sidebar from "@app/layouts/MainLayout/Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Providers } from "@app/app/components/Providers";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";

const MainLayout = ({ children }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector(
    (state: any) => state.auth
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function  checkAuth() {
    await dispatch(checkAuthStatus());
  }
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <>
      <div className="w-full bg-white z-50 fixed">
        <Header user={user} />
      </div>
      <div className="flex mt-[60px]">
        <Sidebar />
        <div className="flex-1 pl-72 pr-8 py-8 bg-[#F0F6FF] min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
