"use client";
import React, { useState, useEffect } from "react";
import { TaskApi } from "../api";
import { TaskProvider } from "../context/TaskContext";
import { DueToday, Stats } from "./DashboardComponent";
import { TaskForm } from "../AllTask/TaskComponent";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_tasks: 0,
    total_done: 0,
    total_pending: 0,
  });
  const [todayTasks, setTodayTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, todayData] = await Promise.all([
        TaskApi.getTaskStats(),
        TaskApi.getTasksDueToday(),
      ]);
      setStats(statsData);
      setTodayTasks(todayData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <TaskForm />
        </div>
        <Stats stats={stats} />
        <DueToday tasks={todayTasks} />
      </div>
    </TaskProvider>
  );
};

export default Dashboard;
