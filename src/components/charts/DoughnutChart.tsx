import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ work }: { work?: boolean }) => {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        borderRadius: 10,
      },
    ],
  };
  const options = {
    cutout: work ? "90%" : "70%",
  };

  return (
    <div className="w-full h-full bg-white px-6 rounded-lg">
      <p className="py-4">Title</p>
      <div className="my-4 relative">
        <Doughnut data={data} options={options} />
        {work && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-xl font-bold text-gray-500">2024-05-06</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoughnutChart;
