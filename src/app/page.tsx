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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <MainLayout>Hello World from next !</MainLayout>
    </div>
  );
};

export default Home;
