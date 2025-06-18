import React from "react";

interface IBreadCrumb {
  title: string;
  children?: React.ReactNode;
}

const BreadCrumb = ({ title, children }: IBreadCrumb) => {
  return (
    <div className="w-full bg-gradient-to-r to-orange-100 from-orange-400 rounded-2xl py-8 px-10 relative border">
      <div className="w-40 h-40 bg-gradient-to-r from-white to-gray-100 rounded-full absolute top-16 -left-20" />
      <div className="w-40 h-40 bg-gradient-to-r from-white to-gray-100 rounded-full absolute -top-5 -right-20" />
      <div className="relative flex items-center justify-between">
        <p className="text-3xl text-white">{title}</p>
      {children}
      </div>
    </div>
  );
};

export default BreadCrumb;
