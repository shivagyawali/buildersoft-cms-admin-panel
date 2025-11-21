"use client";

import {Project } from "@app/app/redux/projectSlice";

import {
  FgDocumentIcon,
  FgEditIcon,
  FgSandGlassIcon,
  FgDeleteIcon,
} from "@app/constants/SVGCollection";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProjectContentProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  projects,
  loading,
  error,
}) => {
  const router = useRouter();

  const projectList = projects?? [];

  if (loading) return <p className="text-center py-10">Loading projects...</p>;
  if (error)
    return <p className="text-red-500 text-center py-10">Error: {error}</p>;

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    router.push(
      `/admin/projects/${project.id}/edit?name=${encodeURIComponent(
        project.name
      )}&description=${encodeURIComponent(project.description || "")}`
    );
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    // TODO: API integration
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );
    if (confirmDelete) {
      toast.success(`Project "${project.name}" deleted successfully!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map((project: Project, idx: any) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
            onClick={() => router.push(`/admin/projects/${project.id}`)}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {project?.name}
                </h2>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  project?.status === "INPROGRESS" ||
                  project?.status === "COMPLETED"
                    ? "bg-green-100 text-[#4BA665]"
                    : "bg-red-100 text-[#8c2d1c]"
                }`}
              >
                {project?.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-4 mb-6 line-clamp-5">
              {project.description || "No description available."}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={(e) => handleEditClick(e, project)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <FgEditIcon />
                Edit
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, project)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <FgDeleteIcon />
                Delete
              </button>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <FgSandGlassIcon />
                <span>
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FgDocumentIcon />
                <span>{project.tasks?.length ?? 0} tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectContent;
