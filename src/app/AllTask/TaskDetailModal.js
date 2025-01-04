import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TaskDetailsModal = ({ task, isOpen, onClose }) => {
  if (!task) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold dark:text-white flex items-center justify-between">
            Task Details
            {/* <Button
              variant="outline"
              size="sm"
              className="gap-2 dark:hover:bg-gray-700"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button> */}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <h3 className={cn("text-xl font-medium dark:text-white")}>
              {task.title}
            </h3>
          </div>

          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Priority
                </h4>
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm",
                    priorityConfig[task.priority].color,
                    priorityConfig[task.priority].bg,
                  )}
                >
                  {task.priority}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Group
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {task.group_name}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Due Date
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {format(new Date(task.due_date), "MMM dd, yyyy")}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Created
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {format(new Date(task.created_at), "MMM dd, yyyy HH:mm")}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Updated
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {format(new Date(task.updated_at), "MMM dd, yyyy HH:mm")}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </h4>
                <p className="text-gray-900 dark:text-gray-200">
                  {task.is_complete ? "Completed" : "In Progress"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
