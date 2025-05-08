// Layout.jsx - Common layout with sidebar
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: <Home size={20} />, text: "Dashboard", path: "/dashboard" },
    { icon: <MessageSquare size={20} />, text: "Journal Chat", path: "/chat" },
    {
      icon: <BarChart2 size={20} />,
      text: "Mood Analytics",
      path: "/analytics",
    },
    { icon: <Settings size={20} />, text: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-square btn-ghost"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        bg-base-100 shadow-xl h-full z-10
        lg:w-64 lg:flex lg:flex-col lg:fixed lg:inset-y-0
        ${sidebarOpen ? "fixed inset-y-0 w-64 flex flex-col" : "hidden"}
      `}
      >
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary">AI Journal</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 rounded-lg hover:bg-base-200
                ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-content"
                    : "text-base-content"
                }
              `}
            >
              {item.icon}
              <span className="ml-3">{item.text}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-base-200"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1 relative z-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
