"use client";
import React, { useState, useContext } from "react";
import {
  Layout,
  X,
  Menu,
  Moon,
  Sun,
  CheckCircle,
  Group,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import Dashboard from "./dashboard/Dashboard";
import AllTask from "./AllTask/AllTask";
import { TaskProvider } from "./context/TaskContext";
import GroupComponent from "./Groups/GroupComponent";
import { AuthContext } from "./context/AuthContext";

const SideBarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const { theme, setTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: "Dashboard", id: "dashboard", icon: Layout },
    { name: "Tasks", id: "tasks", icon: CheckCircle },
    { name: "Group", id: "group", icon: Group },
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return (
          <TaskProvider>
            <AllTask />
          </TaskProvider>
        );
      case "group":
        return (
          <TaskProvider>
            <GroupComponent />
          </TaskProvider>
        );
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative flex flex-col shadow-lg`}
      >
        {/* Updated Header with User Name */}
        <div className="p-4 flex flex-col space-y-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1
              className={`${
                isSidebarOpen ? "block" : "hidden"
              } text-xl font-bold text-blue-600 dark:text-blue-400`}
            >
              TaskFlow
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {isSidebarOpen && user && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Hello, {user.first_name}
            </p>
          )}
        </div>

        {/* Navigation with improved styling */}
        <nav className="flex-1 p-4 space-y-3">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`flex items-center w-full p-3 rounded-lg transition-all transform hover:scale-105 ${
                activeComponent === item.id
                  ? "bg-blue-100 dark:bg-blue-900/30 shadow-md"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon
                size={20}
                className={`${
                  activeComponent === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
              {isSidebarOpen && (
                <span
                  className={`ml-3 font-medium ${
                    activeComponent === item.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all transform hover:scale-105"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105"
          >
            {theme === "dark" ? (
              <>
                <Sun size={20} className="text-yellow-500" />
                {isSidebarOpen && (
                  <span className="ml-3 font-medium">Light Mode</span>
                )}
              </>
            ) : (
              <>
                <Moon size={20} className="text-gray-600" />
                {isSidebarOpen && (
                  <span className="ml-3 font-medium">Dark Mode</span>
                )}
              </>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default SideBarLayout;
