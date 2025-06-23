"use client";
import MainLayout from "@app/layouts/MainLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return <MainLayout />;
};

export default Home;
