import React, { createContext, useContext, useState } from "react";

const TaskContext = createContext(undefined);

export const TaskProvider = ({ children }) => {
  const [taskUpdate, setTaskUpdate] = useState(0);

  const triggerTaskUpdate = () => {
    setTaskUpdate((prev) => prev + 1);
  };

  return (
    <TaskContext.Provider value={{ taskUpdate, triggerTaskUpdate }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
