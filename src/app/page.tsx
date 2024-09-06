"use client"
import MainLayout from "@app/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const route = useRouter();
  
  const goToLogin = () => {
    route.push("/auth/login");
  };

  useEffect(() => {
    goToLogin();
  }, []);
  return (
    <div>
      <MainLayout>Hello World !</MainLayout>
    </div>
  );
};

export default Home;
