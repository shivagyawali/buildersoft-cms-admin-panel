"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import React, { useState } from "react";

const eventsData = [
  {
    id: 1,
    projectName: "Highrise Tower",
    startDate: "2025-09-01",
    status: "Planning",
    description:
      "Initiating blueprint design and permits for downtown skyscraper.",
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
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-based index)
  const [currentYear, setCurrentYear] = useState(2025);

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate calendar for the current month and year
  const generateCalendar = () => {
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks = [];
    let currentWeek = Array(7).fill(null);

    // Fill initial empty days
    for (let i = 0; i < firstDay; i++) {
      currentWeek[i] = { day: null };
    }

    // Fill days of the month
    let day = 1;
    while (day <= daysInMonth) {
      for (let i = firstDay; i < 7 && day <= daysInMonth; i++) {
        currentWeek[i] = {
          day,
          events: eventsData.filter(
            (event) =>
              new Date(event.startDate).getDate() === day &&
              new Date(event.startDate).getMonth() === currentMonth &&
              new Date(event.startDate).getFullYear() === currentYear
          ),
        };
        day++;
        firstDay = 0; // Reset for subsequent weeks
      }
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }

    // Fill remaining days in last week
    if (currentWeek.some((d) => d !== null)) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Handle navigation
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const calendar = generateCalendar();

  return (
    <div
      className="w-full min-h-screen max-h-screen  py-6 px-4 sm:px-6 md:px-8 overflow-y-auto"
      style={{
        
        fontFamily: "'Roboto', 'Arial', sans-serif",
      }}
    >
      <BreadCrumb title="Events" />
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-amber-900 font-extrabold tracking-tight uppercase p-2">
            {monthNames[currentMonth]} {currentYear} Project Calendar
          </h2>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition-colors duration-300"
              onClick={handlePreviousMonth}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition-colors duration-300"
              onClick={handleNextMonth}
            >
              Next
            </button>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl shadow-orange-500/70 p-4 sm:p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-amber-900 font-semibold uppercase">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mt-2">
            {calendar.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="min-h-[100px] sm:min-h-[120px] border border-amber-200/50 p-2 rounded-md transition-all duration-300 hover:bg-amber-100/50"
                >
                  {day?.day && (
                    <>
                      <div className="text-sm font-semibold text-amber-800">
                        {day.day}
                      </div>
                      {day.events.map((event: any) => (
                        <div
                          key={event.id}
                          className="mt-1 p-1 rounded-md text-xs text-white font-semibold cursor-pointer truncate"
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
      </div>
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl shadow-orange-500/80 p-6 max-w-md w-full mx-4 transition-all duration-700">
            <h3 className="text-xl font-bold text-amber-900 uppercase">
              {selectedEvent.projectName}
            </h3>
            <p className="text-sm text-amber-800 mt-2">
              <span className="font-semibold">Start Date:</span>{" "}
              {selectedEvent.startDate}
            </p>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Status:</span>{" "}
              {selectedEvent.status}
            </p>
            <p className="text-sm text-amber-700 mt-2">
              {selectedEvent.description}
            </p>
            <button
              className="mt-4 px-4 py-2 text-white rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-300"
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
