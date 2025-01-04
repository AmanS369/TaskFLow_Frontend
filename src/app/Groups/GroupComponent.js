import React, { useState, useEffect } from "react";
import { TaskApi } from "../api";
import { Search } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TaskForm, UpdateForm } from "../AllTask/TaskComponent";
import { MoreHorizontal, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
import { format } from "date-fns";
import { useTaskContext } from "../context/TaskContext";
import { EditGroupModal, CreateGroupModal } from "./GroupModal";
import TaskDetailsModal from "../AllTask/TaskDetailModal";
const GroupComponent = () => {
  const [groups, setGroups] = useState([]);
  const [openTask, setopenTask] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupTasks, setGroupTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { taskUpdate, triggerTaskUpdate } = useTaskContext();
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const handleDeleteGroup = async (groupId) => {
    try {
      await TaskApi.deleteTaskGroup(groupId);
      triggerTaskUpdate();
      setDeleteConfirmOpen(false);
      setGroupToDelete(null);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [taskUpdate]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupTasks(selectedGroup.id);
    }
  }, [selectedGroup, taskUpdate]);

  const fetchGroups = async () => {
    try {
      const data = await TaskApi.getTaskGroups();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchGroupTasks = async (groupId) => {
    try {
      const tasks = await TaskApi.getTasksByGroup(groupId);
      setGroupTasks(tasks);
    } catch (error) {
      console.error("Error fetching group tasks:", error);
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

  const handleDeleteTask = async (taskId) => {
    try {
      await TaskApi.deleteTask(taskId);
      triggerTaskUpdate();
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

  const filteredGroups = groups.filter(
    (group) =>
      group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search groups..."
            className="pl-10 w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CreateGroupModal />
      </div>

      {!selectedGroup ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-gray-900 dark:border-t-gray-100 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {group.name}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-900"
                    >
                      <DropdownMenuItem
                        className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupForEdit(group);
                        }}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToDelete(group);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent
                  onClick={() => handleGroupClick(group)}
                  className="pt-2"
                >
                  <div className="min-h-[48px]">
                    {" "}
                    {/* Fixed height container for description */}
                    {group.description && (
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full">
                      {group.total_tasks || 0} tasks
                    </span>
                    <span className="text-sm bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 px-3 py-1 rounded-full ml-2">
                      {group.total_tasks > 0
                        ? `${(
                            (group.completed_tasks / group.total_tasks) *
                            100
                          ).toFixed(1)}% complete`
                        : "0% complete"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No groups found. Create a new one to get started.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedGroup(null)}
              className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Groups
            </button>
            <TaskForm group={selectedGroup} />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {selectedGroup.name}
          </h2>

          <div className="space-y-4">
            {groupTasks.map((task) => (
              <Card
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
                key={task.id}
                className="hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      <Checkbox
                        checked={task.is_complete}
                        onCheckedChange={() =>
                          handleTaskComplete(
                            task.id,
                            task.title,
                            task.is_complete,
                          )
                        }
                        className="mt-1 sm:mt-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base sm:text-lg font-medium ${
                            task.is_complete
                              ? "line-through text-gray-500 dark:text-gray-600"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Due: {format(new Date(task.due_date), "MMM dd, yyyy")}{" "}
                          ·{" "}
                          <span
                            className={`font-medium ${
                              task.priority === "High"
                                ? "text-red-600 dark:text-red-400"
                                : task.priority === "Medium"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-gray-900"
                      >
                        <DropdownMenuItem
                          className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleTaskUpdate(task)}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTask && (
        <UpdateForm
          initialTaskData={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {selectedGroupForEdit && (
        <EditGroupModal
          group={selectedGroupForEdit}
          onClose={() => setSelectedGroupForEdit(null)}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Delete Group
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{groupToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              onClick={() => handleDeleteGroup(groupToDelete?.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
    </div>
  );
};

export default GroupComponent;
