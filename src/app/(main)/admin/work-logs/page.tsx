"use client";

import { AppDispatch } from "@app/app/redux/store";
import { getWorkLogs } from "@app/app/redux/workLogSlice";
import BreadCrumb from "@app/components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  ArcElement,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Search,
  Filter as FilterIcon,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  Bell,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Register Chart.js components
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types
interface WorkLog {
  id: string;
  userName: string;
  userEmail: string;
  avatar: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  earnings: number;
  location: string;
}

interface WorkLogsState {
  worklogs: WorkLog[];
  loading: boolean;
  totalPages: number;
}

interface DateRange {
  start: string;
  end: string;
}

interface NotificationItem {
  avatar: string;
  title: string;
  time: string;
}

interface TableContentProps {
  data: WorkLog[];
  loading: boolean;
}

interface NotificationCardProps {
  avatar: string;
  title: string;
  time: string;
}

const AdminWorkLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { worklogs, loading, totalPages } = useSelector(
    (state: { worklogs: WorkLogsState }) => state.worklogs
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: "", end: "" });

  useEffect(() => {
    dispatch(getWorkLogs(currentPage));
  }, [dispatch, currentPage]);

  const mappedData: WorkLog[] = Array.isArray(worklogs)
    ? worklogs.map((log:any) => ({
        id: log.id,
        userName: log?.user?.name,
        userEmail: log?.user?.email,
        avatar: log?.user?.avatar || "/user-placeholder.jpg",
        startTime: moment(log?.startTime).format("hh:mm:ss A"),
        endTime: moment(log?.endTime).format("hh:mm:ss A"),
        totalHours: log?.totalHours,
        earnings: log?.earnings,
        location: `${log?.startLatitude}, ${log?.startLongitude}`,
      }))
    : [];

  // Chart data for hours worked
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Worked",
        data: [12, 19, 13, 15, 12, 8, 5],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions:any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weekly Hours Summary",
        color: "#334155",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Mock notifications
  const notifications: NotificationItem[] = [
    {
      avatar: "/user-placeholder.jpg",
      title: "John Doe started work",
      time: "5 mins ago",
    },
    {
      avatar: "/user-placeholder.jpg",
      title: "Emma Smith completed 8 hours",
      time: "1 hour ago",
    },
    {
      avatar: "/user-placeholder.jpg",
      title: "Sam Wilson exceeded target",
      time: "3 hours ago",
    },
    {
      avatar: "/user-placeholder.jpg",
      title: "New work log system update",
      time: "Yesterday",
    },
  ];

  const FilterPanel: React.FC = () => {
    return (
      <div
        className={`transition-all duration-300 overflow-hidden ${
          filterOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  className="form-input w-full rounded-md border-gray-300 shadow-sm"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                <span>to</span>
                <input
                  type="date"
                  className="form-input w-full rounded-md border-gray-300 shadow-sm"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <select className="form-select pl-10 w-full rounded-md border-gray-300 shadow-sm">
                  <option value="">All Users</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-input pl-10 w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-input pl-10 w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Reset
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TableContentPage: React.FC<TableContentProps> = ({ data, loading }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Start
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                End
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Hours
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Earnings
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-500">Loading work logs...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3 rounded-full mb-2">
                      <Clock size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No work logs found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          src={log.avatar}
                          alt={log.userName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover shadow-sm border border-gray-200"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {log.userName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.endTime}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock size={16} className="text-blue-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {log.totalHours}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {log.earnings}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-36 h-24 rounded-md overflow-hidden shadow-sm border border-gray-200">
                      <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${log.location}&z=15&output=embed`}
                      ></iframe>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const Pagination: React.FC = () => {
    const handlePrevious = (): void => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = (): void => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-sm text-gray-500">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>

          {totalPages <= 5 ? (
            <>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </>
          ) : (
            <>
              {currentPage > 2 && (
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  1
                </button>
              )}

              {currentPage > 3 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  {currentPage - 1}
                </button>
              )}

              <button className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white">
                {currentPage}
              </button>

              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 2 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}

              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              )}
            </>
          )}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  const NotificationCard: React.FC<NotificationCardProps> = ({
    avatar,
    title,
    time,
  }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-10 h-10 overflow-hidden rounded-lg">
        <Image
          src={avatar}
          alt="User"
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <BreadCrumb title="Work Logs" />

      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Hours Today
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">148.5</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock size={24} className="text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">32</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <User size={24} className="text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +5
              </span>
              <span className="text-xs text-gray-500 ml-2">
                since last week
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Today Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">$3,482</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign size={24} className="text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +8%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Avg. Work Time
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4.6h</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <Calendar size={24} className="text-amber-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                -2%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">Work Logs</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-auto">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="form-input pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <FilterIcon size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <FilterPanel />
              <TableContentPage data={mappedData} loading={loading} />
              <Pagination />
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">
                  Hours Overview
                </h2>
                <select className="form-select rounded-md border-gray-300 shadow-sm text-sm">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            {/* Notifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell size={18} className="text-gray-500 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Notifications
                  </h2>
                </div>
                <Link
                  href={"/admin/notifications"}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-1">
                {notifications.map((item, index) => (
                  <NotificationCard
                    key={index}
                    avatar={item.avatar}
                    title={item.title}
                    time={item.time}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <User size={24} className="text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Manage Users
                  </span>
                </Link>

                <Link
                  href="/admin/reports"
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <DollarSign size={24} className="text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    View Reports
                  </span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Clock size={24} className="text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Time Settings
                  </span>
                </Link>

                <Link
                  href="/admin/export"
                  className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Calendar size={24} className="text-amber-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Export Data
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkLogPage;
