// Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, Smile, Frown, Meh } from "lucide-react";
import Layout from "../Layout";

function Dashboard() {
  // Mock data - in a real app, this would come from your backend
  const recentJournals = [
    {
      id: 1,
      date: "2025-05-05",
      summary: "Productive day with team meeting and project progress",
      mood: "positive",
    },
    {
      id: 2,
      date: "2025-05-04",
      summary: "Feeling tired, but made progress on personal goals",
      mood: "neutral",
    },
    {
      id: 3,
      date: "2025-05-03",
      summary: "Struggled with focus today, need to improve sleep",
      mood: "negative",
    },
  ];

  const moodCounts = {
    positive: 12,
    neutral: 8,
    negative: 4,
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "positive":
        return <Smile className="text-success" />;
      case "negative":
        return <Frown className="text-error" />;
      default:
        return <Meh className="text-warning" />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Start Journaling Card */}
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Ready to Journal?</h2>
              <p>Share your thoughts and get AI-powered insights</p>
              <div className="card-actions justify-end mt-4">
                <Link to="/chat" className="btn btn-outline btn-sm">
                  <MessageSquare size={16} className="mr-2" />
                  Start Writing
                </Link>
              </div>
            </div>
          </div>

          {/* Mood Stats Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Mood Overview</h2>
              <div className="flex justify-around mt-4">
                <div className="flex flex-col items-center">
                  <Smile size={28} className="text-success mb-2" />
                  <span className="text-lg font-bold">
                    {moodCounts.positive}
                  </span>
                  <span className="text-xs">Happy</span>
                </div>
                <div className="flex flex-col items-center">
                  <Meh size={28} className="text-warning mb-2" />
                  <span className="text-lg font-bold">
                    {moodCounts.neutral}
                  </span>
                  <span className="text-xs">Neutral</span>
                </div>
                <div className="flex flex-col items-center">
                  <Frown size={28} className="text-error mb-2" />
                  <span className="text-lg font-bold">
                    {moodCounts.negative}
                  </span>
                  <span className="text-xs">Sad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="card bg-accent text-accent-content">
            <div className="card-body">
              <h2 className="card-title">Journal Streak</h2>
              <div className="flex items-center justify-center mt-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">7</div>
                  <div className="text-sm">Days in a row</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Journals */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Journal Entries</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Summary</th>
                    <th>Mood</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJournals.map((journal) => (
                    <tr key={journal.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {new Date(journal.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-xs truncate">{journal.summary}</td>
                      <td>
                        <div className="flex items-center">
                          {getMoodIcon(journal.mood)}
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/chat?date=${journal.date}`}
                          className="btn btn-ghost btn-xs"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-actions justify-center mt-4">
              <Link to="/analytics" className="btn btn-outline">
                View All Entries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
