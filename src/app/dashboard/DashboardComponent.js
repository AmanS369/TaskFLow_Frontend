import { useState, useEffect } from "react";
import { TaskApi } from "../api";
import { ListTodo } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTaskContext } from "../context/TaskContext";
import { UpdateForm } from "../AllTask/TaskComponent";
import { Clock, CheckCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import TaskDetailsModal from "../AllTask/TaskDetailModal";

export const Stats = () => {
  const { taskUpdate } = useTaskContext();
  const [stats, setStats] = useState({
    total_tasks: 0,
    total_done: 0,
    total_pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const statsData = await TaskApi.getTaskStats();
      setStats(statsData);
    };
    fetchStats();
  }, [taskUpdate]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total_tasks}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total_done}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-600" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total_pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
      </div>
    </div>
  );
};

export const DueToday = () => {
  const { triggerTaskUpdate, taskUpdate } = useTaskContext();
  const [todayTasks, setTodayTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openTask, setOpenTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleTaskComplete = async (taskId, title) => {
    try {
      await TaskApi.updateTask(taskId, { is_complete: true, title: title });
      triggerTaskUpdate();
    } catch (error) {
      console.error("Error completing task:", error);
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

  const initiateDelete = (task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await TaskApi.deleteTask(taskId);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
      triggerTaskUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const tasks = await TaskApi.getTasksDueToday();
      const sortedTasks = sortByPriority(tasks);
      setTodayTasks(sortedTasks);
    };
    fetchTodayTasks();
  }, [taskUpdate]);

  const sortByPriority = (tasks) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-800",
        };
      case "Medium":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-400",
          border: "border-yellow-200 dark:border-yellow-800",
        };
      case "Low":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Due Today
          </h2>
          <div className="flex flex-wrap gap-3">
            {["High", "Medium", "Low"].map((priority) => {
              const colors = getPriorityColor(priority);
              return (
                <div
                  key={priority}
                  className={`px-3 py-1 rounded-lg ${colors.bg} ${colors.text} text-sm font-medium`}
                >
                  {priority}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {todayTasks &&
          todayTasks.map((task) => {
            const priorityColors = getPriorityColor(task.priority);
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                onClick={(e) => {
                  if (
                    !e.target.closest(".checkbox-container") &&
                    !e.target.closest('[role="menuitem"]') &&
                    !e.target.closest("[data-state]")
                  ) {
                    setOpenTask(task);
                    setIsDetailsModalOpen(true);
                  }
                }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskComplete(task.id, task.title);
                    }}
                    className={`rounded-full p-1 transition-colors duration-200 ${
                      task.completed
                        ? "text-green-500 hover:text-green-600"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <span
                    className={`text-gray-900 dark:text-gray-100 ${
                      task.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${priorityColors.bg} ${priorityColors.text}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <MoreVertical
                      size={16}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => handleTaskUpdate(task)}
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => initiateDelete(task)}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        {todayTasks.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tasks due today
          </div>
        )}
      </div>

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
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{taskToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              onClick={() => handleTaskDelete(taskToDelete?.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
