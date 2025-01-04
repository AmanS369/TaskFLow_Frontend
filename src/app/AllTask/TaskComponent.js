import { TaskApi } from "../api";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PropTypes from "prop-types";

export const TaskForm = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const { triggerTaskUpdate } = useTaskContext();
  const [selectedGroup, setSelectedGroup] = useState(
    group ? group.name : "Select a group",
  );

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    group: group?.id || "",
    due_date: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!group) {
      const fetchGroups = async () => {
        try {
          const groupsData = await TaskApi.getTaskGroups();
          setGroups(groupsData);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };
      fetchGroups();
    }
  }, [group]);

  const validateForm = () => {
    const newErrors = {};
    if (!taskData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!taskData.priority) {
      newErrors.priority = "Priority is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTaskData = {
      ...taskData,
      dueDate: taskData.due_date
        ? new Date(taskData.due_date).toISOString().split("T")[0]
        : "",
    };

    if (validateForm()) {
      await TaskApi.createTask(formattedTaskData);
      triggerTaskUpdate();
      setIsOpen(false);
      setTaskData({
        title: "",
        description: "",
        priority: "Medium",
        group: group?.id || "",
        due_date: "",
      });
      setSelectedGroup(group ? group.name : "Select a group");
    }
  };

  const priorityColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {!group ? "Create New Task" : `Create New Task in ${group.name}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              placeholder="Enter task title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              placeholder="Enter task description"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-3">
              {["Low", "Medium", "High"].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setTaskData({ ...taskData, priority })}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    taskData.priority === priority
                      ? priorityColors[priority]
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {!group && groups.length > 0 && (
            <div className="space-y-2">
              <Label>Group</Label>
              <Select
                value={taskData.group}
                onValueChange={(value) => {
                  setTaskData({ ...taskData, group: value });
                  const selectedGroupName = groups.find(
                    (g) => g.id === value,
                  )?.name;
                  if (selectedGroupName) {
                    setSelectedGroup(selectedGroupName);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a group">
                    {selectedGroup}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <div className="relative">
              <Input
                id="due_date"
                type="date"
                value={taskData.due_date}
                onChange={(e) =>
                  setTaskData({ ...taskData, due_date: e.target.value })
                }
                className="w-full"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const UpdateForm = ({ initialTaskData, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [groups, setGroups] = useState([]);
  const { triggerTaskUpdate } = useTaskContext();
  const [taskData, setTaskData] = useState(initialTaskData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsData = await TaskApi.getTaskGroups();
      setGroups(groupsData);
    };
    fetchGroups();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!taskData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    if (!taskData.priority) {
      newErrors.priority = "Priority is required";
    }
    if (!taskData.group) {
      newErrors.group = "Group is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const formattedTaskData = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          group: taskData.group,
          due_date: taskData.due_date
            ? new Date(taskData.due_date).toISOString().split("T")[0]
            : null,
          is_complete: taskData.is_complete,
        };

        await TaskApi.updateTask(taskData.id, formattedTaskData);
        triggerTaskUpdate();
        handleClose();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows="3"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority *
            </label>
            <div className="flex space-x-4">
              {["Low", "Medium", "High"].map((priority) => (
                <label key={priority} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={taskData.priority === priority}
                    onChange={(e) =>
                      setTaskData({ ...taskData, priority: e.target.value })
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm capitalize">{priority}</span>
                </label>
              ))}
            </div>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group
            </label>
            <Select
              value={taskData.group}
              onValueChange={(value) =>
                setTaskData({ ...taskData, group: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a group">
                  {groups.find((g) => g.id === taskData.group)?.name ||
                    "Select a group"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.group && (
              <p className="text-red-500 text-sm mt-1">{errors.group}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={taskData.due_date || ""}
              onChange={(e) =>
                setTaskData({ ...taskData, due_date: e.target.value })
              }
              className="w-full"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Update Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
