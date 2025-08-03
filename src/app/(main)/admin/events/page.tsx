
"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import React, { useState } from "react";

const eventsData:any = [
  {
    id: 1,
    projectName: "Highrise Tower",
    startDate: "2025-09-01",
    status: "Planning",
    description: "Initiating blueprint design and permits for downtown skyscraper.",
    color: "#F97316",
  },
  {
    id: 2,
    projectName: "Bridge Reconstruction",
    startDate: "2025-10-15",
    status: "Construction",
    description: "Rebuilding main span with new steel framework.",
    color: "#D97706",
  },
  {
    id: 3,
    projectName: "Residential Complex",
    startDate: "2025-11-01",
    status: "Inspection",
    description: "Final safety checks before tenant move-in.",
    color: "#1D4ED8",
  },
  {
    id: 4,
    projectName: "Highway Expansion",
    startDate: "2025-12-01",
    status: "Completed",
    description: "Completed widening of I-95 with new lanes open.",
    color: "#059669",
  },
];

const Events = () => {
  const [selectedEvent, setSelectedEvent]:any = useState(null);
  const [currentMonth, setCurrentMonth]:any = useState(7);
  const [currentYear, setCurrentYear] = useState(2025);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const generateCalendar = () => {
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks = [];
    let currentWeek = Array(7).fill(null);

    for (let i = 0; i < firstDay; i++) currentWeek[i] = { day: null };
    let day = 1;
    while (day <= daysInMonth) {
      for (let i = firstDay; i < 7 && day <= daysInMonth; i++) {
        currentWeek[i] = {
          day,
          events: eventsData.filter(
            (event:any) =>
              new Date(event.startDate).getDate() === day &&
              new Date(event.startDate).getMonth() === currentMonth &&
              new Date(event.startDate).getFullYear() === currentYear
          ),
        };
        day++;
        firstDay = 0;
      }
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
    if (currentWeek.some((d) => d !== null)) weeks.push(currentWeek);
    return weeks;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev:any) => (prev === 0 ? (setCurrentYear((y) => y - 1), 11) : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev:any) => (prev === 11 ? (setCurrentYear((y) => y + 1), 0) : prev + 1));
  };

  const upcomingEvents = eventsData
    .filter((event:any) => new Date(event.startDate) >= new Date(currentYear, currentMonth, 1))
    .sort((a:any, b:any) => new Date(a?.startDate) - new Date(b?.startDate));

  const calendar = generateCalendar();

  return (
    <div className=" mb-8 py-4 px-4 sm:px-6  font-['Roboto',Arial,sans-serif] overflow-y-auto">
      <BreadCrumb title="Events" />
      <div className="max-w-7xl mx-auto mt-4 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl text-amber-900 font-extrabold tracking-tight uppercase p-2">
            {monthNames[currentMonth]} {currentYear} Projects
          </h2>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 shadow-md"
              onClick={handlePreviousMonth}
            >
              Prev
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 shadow-md"
              onClick={handleNextMonth}
            >
              Next
            </button>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-md rounded-xl  p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-amber-900 font-semibold uppercase text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mt-2">
            {calendar.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="min-h-[90px] border border-amber-200/30 p-2 rounded-lg hover:bg-amber-50 transition-all duration-200"
                >
                  {day?.day && (
                    <>
                      <div className="text-sm font-semibold text-amber-800">
                        {day.day}
                      </div>
                      {day.events.map((event: any) => (
                        <div
                          key={event.id}
                          className="mt-1 p-1 rounded text-xs text-white font-medium cursor-pointer truncate"
                          style={{ backgroundColor: event.color }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.projectName}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-6 bg-white/95  rounded-xl  p-4 gap-3 mb-8">
          <h3 className="text-xl font-bold text-amber-900 uppercase mb-4">
            Upcoming Projects
          </h3>
          <div className="space-y-5 gap-3">
            {upcomingEvents.length ? (
              upcomingEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center p-3 rounded-lg bg-amber-50/50 hover:bg-amber-100 transition-all duration-200"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="flex-1 p-1/2">
                    <h4 className="text-sm font-semibold text-amber-900">
                      {event.projectName}
                    </h4>
                    <p className="text-xs text-amber-700">
                      <span className="font-medium">Start:</span>{" "}
                      {event.startDate} |{" "}
                      <span className="font-medium">Status:</span>{" "}
                      {event.status}
                    </p>
                    <p className="text-xs text-amber-600">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-amber-700">
                No upcoming projects for this period.
              </p>
            )}
          </div>
        </div>
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl shadow-orange-500/70 p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <h3 className="text-lg font-bold text-amber-900 uppercase">
              {selectedEvent.projectName}
            </h3>
            <p className="text-sm text-amber-800 mt-2">
              <span className="font-medium">Start Date:</span>{" "}
              {selectedEvent.startDate}
            </p>
            <p className="text-sm text-amber-800">
              <span className="font-medium">Status:</span>{" "}
              {selectedEvent.status}
            </p>
            <p className="text-sm text-amber-700 mt-2">
              {selectedEvent.description}
            </p>
            <button
              className="mt-4 px-4 py-2 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors duration-200"
              style={{ backgroundColor: selectedEvent.color }}
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
