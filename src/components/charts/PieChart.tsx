"use client";
import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Legend, Tooltip);

const PieChart = () => {
  const data = {
    labels: ["One", "Two", "Three", "Four"],
    datasets: [
      {
        label: "Project Stats",
        data: [25, 25, 18, 32],
        backgroundColor: ["#625ED7", "#39B4F3", "#D32C20", "#238899"],
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: 20,
          boxWidth: 20,
          boxHeight: 20,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white py-8 px-6 rounded-lg">
      <div className="flex items-center mb-8">
        <p className="text-2xl text-[#0E2040]">Project Stats</p>
      </div>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
