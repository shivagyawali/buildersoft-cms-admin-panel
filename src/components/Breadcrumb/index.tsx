import React from "react";

interface IBreadCrumb {
  title: string;
  children?: React.ReactNode;
}

const BreadCrumb = ({ title, children }: IBreadCrumb) => {
  return (
    <div className="w-full bg-gradient-to-r from-primary-400 to-primary-100 rounded-2xl py-6 px-8 relative border border-primary-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {/* Decorative Background Circles */}
      <div className="w-32 h-32 bg-gradient-to-r from-white/50 to-gray-100/30 rounded-full absolute top-12 -left-16 opacity-70 animate-pulse" />
      <div className="w-32 h-32 bg-gradient-to-r from-white/50 to-gray-100/30 rounded-full absolute -top-4 -right-16 opacity-70 animate-pulse" />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-4">{children}</div>
      </div>
    </div>
  );
};

export default BreadCrumb;
