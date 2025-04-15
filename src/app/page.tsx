"use client"
import MainLayout from "@app/layouts/MainLayout";
import useAuthRedirect from "./hooks/useAuthRedirect";

const Home = () => {
    const { user } = useAuthRedirect();
  return (
    <div>
      <MainLayout/>
    </div>
  );
};

export default Home;
