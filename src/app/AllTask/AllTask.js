"use client";
import React, { useState, useEffect } from "react";
import { TaskApi } from "../api";
import { useTaskContext } from "../context/TaskContext";
import { TaskForm, UpdateForm } from "./TaskComponent";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import TaskDetailsModal from "./TaskDetailModal";
import TaskFilters from "./TaskFilter";

const AllTask = () => {
  const { taskUpdate, triggerTaskUpdate } = useTaskContext();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [filters, setFilters] = useState({
    sortBy: "recent",
    status: "all",
    priority: "all",
    dueDate: "all",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTask, setopenTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Priority colors mapping
  const priorityConfig = {
    High: {
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-950",
    },
    Medium: {
      color: "text-yellow-500 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-950",
    },
    Low: {
      color: "text-green-500 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-950",
    },
  };

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, [taskUpdate]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters, date, selectedGroups, searchQuery]);

  const fetchTasks = async () => {
    try {
      const taskData = await TaskApi.getAllTask();
      setTasks(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groupData = await TaskApi.getTaskGroups();
      setGroups(groupData);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleTaskComplete = async (taskId, title, currentStatus) => {
    try {
      await TaskApi.updateTask(taskId, {
        is_complete: !currentStatus,
        title: title,
      });
      triggerTaskUpdate();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteTask = async () => {
    try {
      await TaskApi.deleteTask(taskToDelete.id);
      triggerTaskUpdate();
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskUpdate = (task) => {
    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      group: task.group || "",
      due_date: task.due_date || "",
      is_complete: task.is_complete || false,
    };
    setSelectedTask(formattedTask);
  };

  const clearDateRange = () => {
    setDate({
      from: null,
      to: null,
    });
  };

  const handleGroupToggle = (groupId) => {
    setSelectedGroups((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      }
      return [...prev, groupId];
    });
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      );
    }

    // Sort by date
    if (filters.sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((task) =>
        filters.status === "completed" ? task.is_complete : !task.is_complete,
      );
    }

    // Filter by selected groups
    if (selectedGroups.length > 0) {
      filtered = filtered.filter((task) => selectedGroups.includes(task.group));
    }

    // Filter by priority
    if (filters.priority !== "all") {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (date.from && date.to) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        const fromDate = new Date(date.from);
        const toDate = new Date(date.to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        return taskDate >= fromDate && taskDate <= toDate;
      });
    }

    if (filters.dueDate !== "all") {
      filtered = filtered.filter((task) => {
        const taskDueDate = new Date(task.due_date);
        taskDueDate.setHours(0, 0, 0, 0);

        if (filters.dueDate === "upcoming") {
          return taskDueDate >= currentDate;
        } else if (filters.dueDate === "missed") {
          return taskDueDate < currentDate && !task.is_complete;
        }
        return true;
      });
    }
    setFilteredTasks(filtered);
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-white">Tasks</h1>
        <TaskForm />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-3 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "gap-2 dark:bg-gray-800 dark:text-white dark:border-gray-700 relative pr-8 whitespace-nowrap",
                  date.from && "text-primary",
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {date.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date"
                  )}
                </span>
                <span className="sm:hidden">Date</span>
                {date.from && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateRange();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        clearDateRange();
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Task Filters */}
          <TaskFilters
            filters={filters}
            setFilters={setFilters}
            selectedGroups={selectedGroups}
            handleGroupToggle={handleGroupToggle}
            groups={groups}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <CardContent
                className="p-4 cursor-pointer"
                onClick={(e) => {
                  if (
                    !e.target.closest(".checkbox-container") &&
                    !e.target.closest('[role="menuitem"]') &&
                    !e.target.closest("[data-state]")
                  ) {
                    setopenTask(task);
                    setIsDetailsModalOpen(true);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={task.is_complete}
                      onCheckedChange={() =>
                        handleTaskComplete(
                          task.id,
                          task.title,
                          task.is_complete,
                        )
                      }
                      className="dark:border-gray-600"
                    />
                    <div>
                      <h3
                        className={cn(
                          "text-lg font-medium dark:text-white",
                          task.is_complete &&
                            "line-through text-gray-500 dark:text-gray-400",
                        )}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ·
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {task.group_name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ·
                        </span>
                        <span
                          className={cn(
                            "text-sm px-2 py-0.5 rounded-full",
                            priorityConfig[task.priority].color,
                            priorityConfig[task.priority].bg,
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="dark:text-gray-400 dark:hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-gray-800"
                    >
                      <DropdownMenuItem
                        className="gap-2 dark:text-gray-200 dark:focus:bg-gray-700"
                        onClick={() => handleTaskUpdate(task)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-600 dark:text-red-400 dark:focus:bg-gray-700"
                        onClick={() => handleDeleteClick(task)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No tasks found. Create a new one! 😊
            </p>
            <TaskForm className="inline-flex items-center justify-center" />
          </div>
        )}
      </div>

      {isTaskFormOpen && <TaskForm onClose={() => setIsTaskFormOpen(false)} />}
      {selectedTask && (
        <UpdateForm
          initialTaskData={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {openTask && (
        <TaskDetailsModal
          task={openTask}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                "{taskToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 border-0"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setTaskToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 border-0"
              onClick={handleDeleteTask}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllTask;
