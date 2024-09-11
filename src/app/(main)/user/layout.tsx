import UserLayout from "@app/layouts/UserLayout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <UserLayout>{children}</UserLayout>
    </div>
  );
};

export default layout;
