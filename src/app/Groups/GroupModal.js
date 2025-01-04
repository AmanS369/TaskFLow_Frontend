import React, { useState } from "react";
import { TaskApi } from "../api";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTaskContext } from "../context/TaskContext";

export const EditGroupModal = ({ group, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description || "",
  });
  const [errors, setErrors] = useState({});
  const { triggerTaskUpdate } = useTaskContext();

  const validateForm = () => {
    const newErrors = {};
    if (!groupData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await TaskApi.updateTaskGroup(group.id, groupData);
        triggerTaskUpdate();
        handleClose();
      } catch (error) {
        console.error("Error updating group:", error);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({ ...groupData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter group name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={groupData.description}
              onChange={(e) =>
                setGroupData({ ...groupData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows="3"
              placeholder="Enter group description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Update Group
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export const CreateGroupModal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const { triggerTaskUpdate } = useTaskContext();

  const validateForm = () => {
    const newErrors = {};
    if (!groupData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await TaskApi.createTaskGroup(groupData);
        triggerTaskUpdate();
        setIsOpen(false);
        setGroupData({ name: "", description: "" });
        onClose?.();
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({ ...groupData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter group name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={groupData.description}
              onChange={(e) =>
                setGroupData({ ...groupData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows="3"
              placeholder="Enter group description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Group
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
