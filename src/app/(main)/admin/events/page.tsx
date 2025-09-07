"use client";
import BreadCrumb from "@app/components/Breadcrumb";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@app/app/redux/store";
import { getEvents } from "@app/app/redux/eventSlice";

const Events = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, loading, error } = useSelector((state: any) => state.events);

  const [selectedEvent, setSelectedEvent]: any = useState(null);
  const [currentMonth, setCurrentMonth]: any = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getEvents(1));
  }, [dispatch]);

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

  const generateCalendar = () => {
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks: any[] = [];
    let currentWeek = Array(7).fill(null);

    for (let i = 0; i < firstDay; i++) currentWeek[i] = { day: null };
    let day = 1;

    while (day <= daysInMonth) {
      for (let i = firstDay; i < 7 && day <= daysInMonth; i++) {
        currentWeek[i] = {
          day,
          events: events.filter(
            (event: any) =>
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
    setCurrentMonth((prev: any) =>
      prev === 0 ? (setCurrentYear((y) => y - 1), 11) : prev - 1
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev: any) =>
      prev === 11 ? (setCurrentYear((y) => y + 1), 0) : prev + 1
    );
  };

  const upcomingEvents = events
    .filter(
      (e: any) =>
        new Date(e.startDate).getTime() >=
        new Date(currentYear, currentMonth, 1).getTime()
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const calendar = generateCalendar();

  return (
    <div className="mb-10 py-6 px-4 sm:px-6 font-['Roboto',Arial,sans-serif] overflow-y-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen">
      <BreadCrumb title="Events" />

      <div className="max-w-7xl mx-auto mt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700 font-extrabold tracking-tight uppercase drop-shadow-lg">
            {monthNames[currentMonth]} {currentYear} Projects
          </h2>
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              onClick={handlePreviousMonth}
            >
              ◀ Prev
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              onClick={handleNextMonth}
            >
              Next ▶
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-amber-100/50">
          <div className="grid grid-cols-7 gap-2 text-center text-amber-900 font-semibold uppercase text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-3">
            {calendar.map((week, weekIndex) =>
              week.map((day: any, dayIndex: number) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="min-h-[100px] border border-amber-200/50 p-2 rounded-xl bg-white/60 hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {day?.day && (
                    <>
                      <div className="text-sm font-bold text-amber-800 mb-1">
                        {day.day}
                      </div>
                      {day.events.map((event: any) => (
                        <div
                          key={event.id}
                          className="mt-1 px-2 py-1 rounded-md text-xs text-white font-medium cursor-pointer truncate shadow hover:scale-105 transform transition"
                          style={{ backgroundColor: event.color }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 bg-white/80 rounded-2xl shadow-lg p-6 border border-amber-100/50">
          <h3 className="text-3xl font-bold text-amber-900 uppercase mb-6 tracking-wide h-full">
            Upcoming Projects
          </h3>
          <div className="space-y-5">
            {upcomingEvents.length ? (
              upcomingEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 cursor-pointer group border border-amber-200/40 shadow hover:shadow-lg"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div
                    className="w-4 h-4 mt-1 rounded-full shrink-0 shadow"
                    style={{ backgroundColor: event.color }}
                  ></div>

                  <div className="flex-1">
                    {/* Title */}
                    <h4 className="text-lg font-semibold text-amber-900 group-hover:underline truncate">
                      {event.title}
                    </h4>

                    {/* Dates & Status */}
                    <p className="text-sm text-amber-800 mt-1">
                      <span className="font-medium">Start:</span>{" "}
                      {new Date(event.startDate).toLocaleDateString()}{" "}
                      &nbsp;|&nbsp;
                      <span className="font-medium">End:</span>{" "}
                      {new Date(event.endDate).toLocaleDateString()}{" "}
                      &nbsp;|&nbsp;
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          event.status === "INPROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : event.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </p>

                    {/* Type */}
                    <p className="text-xs font-semibold text-amber-600 mt-1 uppercase tracking-wide">
                      {event.type}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-amber-700 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-amber-700 italic">
                No upcoming projects for this period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-fadeIn">
            {/* Header */}
            <h3 className="text-2xl font-bold text-amber-900 uppercase mb-3">
              {selectedEvent.title}
            </h3>

            {/* Fields */}
            <div className="space-y-3 text-sm text-amber-800">
              <p>
                <span className="font-medium">Description:</span>{" "}
                {selectedEvent.description}
              </p>
              <p>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(selectedEvent.startDate).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(selectedEvent.endDate).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedEvent.status === "INPROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : selectedEvent.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Type:</span> {selectedEvent.type}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Color:</span>{" "}
                <span
                  className="w-5 h-5 rounded-full border border-amber-300"
                  style={{ backgroundColor: selectedEvent.color }}
                ></span>
                <span>{selectedEvent.color}</span>
              </p>
            </div>

            {/* Close button */}
            <button
              className="mt-6 px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Loading & Error */}
      {loading && (
        <p className="text-center text-amber-700 mt-6 animate-pulse">
          Loading events...
        </p>
      )}
      {error && <p className="text-center text-red-600 mt-6">Error: {error}</p>}
    </div>
  );
};

export default Events;
