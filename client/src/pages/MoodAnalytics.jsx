// MoodAnalytics.jsx
import React, { useState } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "../Layout";

function MoodAnalytics() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data - in a real app, this would come from your backend
  const moodData = {
    "2025-05-01": { mood: "positive", summary: "Great productive day" },
    "2025-05-02": { mood: "positive", summary: "Enjoyed time with friends" },
    "2025-05-03": { mood: "negative", summary: "Stressed about deadline" },
    "2025-05-04": { mood: "neutral", summary: "Regular day, nothing special" },
    "2025-05-05": { mood: "positive", summary: "Made progress on project" },
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "positive":
        return "bg-success";
      case "negative":
        return "bg-error";
      default:
        return "bg-warning";
    }
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const days = [];

    // Fill in empty spaces for days before the 1st of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      days.push({
        date: day,
        dateString,
        mood: moodData[dateString]?.mood || null,
        summary: moodData[dateString]?.summary || null,
      });
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate mood percentages
  const moodCounts = Object.values(moodData).reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const totalEntries = Object.values(moodCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const moodPercentages = {
    positive:
      Math.round(((moodCounts.positive || 0) / totalEntries) * 100) || 0,
    neutral: Math.round(((moodCounts.neutral || 0) / totalEntries) * 100) || 0,
    negative:
      Math.round(((moodCounts.negative || 0) / totalEntries) * 100) || 0,
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mood Analytics</h1>

        {/* Mood Stats */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Monthly Mood Overview</h2>
            <div className="flex gap-4 mt-4">
              <div className="stats shadow flex-1">
                <div className="stat">
                  <div className="stat-title">Positive Days</div>
                  <div className="stat-value text-success">
                    {moodPercentages.positive}%
                  </div>
                  <div className="stat-desc">
                    {moodCounts.positive || 0} entries
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Neutral Days</div>
                  <div className="stat-value text-warning">
                    {moodPercentages.neutral}%
                  </div>
                  <div className="stat-desc">
                    {moodCounts.neutral || 0} entries
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title">Challenging Days</div>
                  <div className="stat-value text-error">
                    {moodPercentages.negative}%
                  </div>
                  <div className="stat-desc">
                    {moodCounts.negative || 0} entries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Mood Calendar</h2>
              <div className="flex items-center gap-2">
                <button className="btn btn-sm btn-ghost" onClick={prevMonth}>
                  <ArrowLeft size={16} />
                </button>
                <span className="text-lg font-medium">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button className="btn btn-sm btn-ghost" onClick={nextMonth}>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Weekday headers */}
              {weekdays.map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day, index) => (
                <div key={index} className="p-1">
                  {day && (
                    <div
                      className={`
                        rounded-lg p-2 h-16 flex flex-col relative
                        ${
                          day.mood
                            ? getMoodColor(day.mood) + " bg-opacity-20"
                            : "bg-base-200"
                        }
                        hover:bg-opacity-30 cursor-pointer
                      `}
                      title={day.summary || "No entry"}
                    >
                      <span className="text-sm">{day.date}</span>
                      {day.mood && (
                        <div
                          className={`w-3 h-3 rounded-full absolute top-2 right-2 ${getMoodColor(
                            day.mood
                          )}`}
                        ></div>
                      )}
                      {day.summary && (
                        <span className="text-xs mt-1 truncate">
                          {day.summary}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MoodAnalytics;
