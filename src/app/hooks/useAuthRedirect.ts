"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "@app/app/redux/authSlice";
import { AppDispatch } from "@app/app/redux/store";

const useAuthRedirect = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, user, loading } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const hasToken = localStorage.getItem("token");
    if (loading) return;
    if (!loading) {
      if (!hasToken && !isAuthenticated && !user) {
        localStorage.removeItem("token")
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, loading, user, router]);

  return { user, isAuthenticated, loading };
};

export default useAuthRedirect;
