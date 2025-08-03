"use client";
import { ArcElement, Chart, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip);

const PieChart = () => {
  const data = {
    labels: ["Planning", "Construction", "Inspection", "Completed"],
    datasets: [
      {
        label: "Project Phases",
        data: [25, 25, 18, 32],
        backgroundColor: ["#F97316", "#D97706", "#1D4ED8", "#059669"],
        borderColor: ["#ffffffff", "#ffffffff", "#ffffffff", "#ffffffff"],
        borderWidth: 2,
        hoverOffset: 50,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove legend list
      },
      tooltip: {
        backgroundColor: "#a0770fff",
        titleFont: {
          size: 16,
          weight: "bold",
          family: "'Roboto', 'Arial', sans-serif",
        },
        bodyFont: { size: 14, family: "'Roboto', 'Arial', sans-serif" },
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
        borderColor: "#F97316",
        borderWidth: 2,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1800,
      easing: "easeOutQuart",
    },
  };

  return (
    <div
      className="w-full max-h-screen bg-gradient-to-br from-orange-600/30 to-amber-700/30 py-6 px-4 sm:px-6 md:px-8 rounded-2xl shadow-2xl shadow-orange-500/60 overflow-hidden transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%),
          url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        fontFamily: "'Roboto', 'Arial', sans-serif",
      }}
    >
      <div className="flex items-center mb-6 h-full">
        <p className="text-xl sm:text-2xl md:text-3xl text-orange-500 font-extrabold tracking-tight uppercase h-full p-2 bg-white border-2 rounded-xl border-red-900">
          Project Phases
        </p>
      </div>
      <div className="relative h-52 sm:h-64 md:h-80 lg:h-96">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
