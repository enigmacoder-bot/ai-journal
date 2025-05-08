// Settings.jsx
import React, { useState } from "react";
import Layout from "../Layout";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    reminders: true,
    reminderTime: "20:00",
    weeklyReport: true,
    shareData: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to backend (would be implemented in a real app)
    alert("Settings saved successfully!");
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* App Preferences */}
                <div>
                  <h2 className="text-xl font-medium mb-4">App Preferences</h2>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        name="darkMode"
                        checked={settings.darkMode}
                        onChange={handleChange}
                      />
                      <span className="label-text">Dark Mode</span>
                    </label>
                  </div>

                  <div className="form-control mt-2">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        name="notifications"
                        checked={settings.notifications}
                        onChange={handleChange}
                      />
                      <span className="label-text">Enable Notifications</span>
                    </label>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Reminders */}
                <div>
                  <h2 className="text-xl font-medium mb-4">
                    Journal Reminders
                  </h2>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        name="reminders"
                        checked={settings.reminders}
                        onChange={handleChange}
                      />
                      <span className="label-text">Daily Reminders</span>
                    </label>
                  </div>

                  {settings.reminders && (
                    <div className="form-control mt-2">
                      <label className="label">
                        <span className="label-text">Reminder Time</span>
                      </label>
                      <input
                        type="time"
                        className="input input-bordered"
                        name="reminderTime"
                        value={settings.reminderTime}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="form-control mt-2">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        name="weeklyReport"
                        checked={settings.weeklyReport}
                        onChange={handleChange}
                      />
                      <span className="label-text">Weekly Progress Report</span>
                    </label>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Privacy */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Privacy Settings</h2>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        name="shareData"
                        checked={settings.shareData}
                        onChange={handleChange}
                      />
                      <span className="label-text">
                        Share anonymous data to improve AI
                      </span>
                    </label>
                    <p className="text-xs text-base-content/70 ml-12">
                      We never share your personal information or journal
                      entries
                    </p>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Account */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Account</h2>

                  <div className="space-y-4">
                    <button type="button" className="btn btn-outline w-full">
                      Change Password
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline btn-error w-full"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <button type="submit" className="btn btn-primary w-full">
                    Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
