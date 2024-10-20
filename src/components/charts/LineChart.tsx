import { CategoryScale, Chart } from "chart.js/auto";
import React from "react";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale);

const LineChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Achieved",
        data: [65, 75, 85, 80, 63, 77, 60],
        fill: false,
        borderColor: "#FB896B",
        tension: 0.2,
      },
      {
        label: "Target",
        data: [22, 44, 30, 50, 55, 40, 35],
        fill: false,
        borderColor: "#6956E5",
        tension: 0.2,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      label: {
        display: true,
        backgroundColor: "red",
      },
    },
  };
  return (
    <div className="w-full h-full bg-white py-8 px-6 rounded-lg flex items-center justify-center">
      <Line data={data} options={options} className="bg-red" />
    </div>
  );
};

export default LineChart;
