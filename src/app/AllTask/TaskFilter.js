import React, { useState, useEffect } from "react";
import { Filter, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TaskFilters = ({
  filters,
  setFilters,
  selectedGroups,
  handleGroupToggle,
  groups,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState(groups);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getActiveFilterCount = () => {
    let count = selectedGroups.length;

    // Count non-default filter values
    if (filters.sortBy !== "recent") count++;
    if (filters.status !== "all") count++;
    if (filters.priority !== "all") count++;
    if (filters.dueDate !== "all") count++;

    return count;
  };

  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Sort By Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Sort By
        </h4>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Status Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Status
        </h4>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Groups Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
            Groups
          </h4>
          {selectedGroups.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleGroupToggle(null, true)}
              className="h-8 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
          />
        </div>

        <ScrollArea className="h-48 rounded-md border border-gray-200 dark:border-gray-700 px-1">
          <div className="space-y-1 p-2">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Checkbox
                  id={`group-${group.id}`}
                  checked={selectedGroups.includes(group.id)}
                  onCheckedChange={() => handleGroupToggle(group.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={`group-${group.id}`}
                  className="flex-1 text-sm cursor-pointer text-gray-700 dark:text-gray-200"
                >
                  {group.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Priority Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Priority
        </h4>
        <Select
          value={filters.priority}
          onValueChange={(value) => setFilters({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-gray-200 dark:bg-gray-700" />

      {/* Due Date Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Due Date
        </h4>
        <Select
          value={filters.dueDate}
          onValueChange={(value) => setFilters({ ...filters, dueDate: value })}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Due Date Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Due Dates</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <div className="flex gap-1">
              <Badge variant="secondary">
                {selectedGroups.length > 0
                  ? `Groups: ${selectedGroups.length}`
                  : ""}
              </Badge>
              <Badge variant="secondary">
                {getActiveFilterCount() - selectedGroups.length > 0
                  ? `Filters: ${getActiveFilterCount() - selectedGroups.length}`
                  : ""}
              </Badge>
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <div className="flex gap-1">
              <Badge variant="secondary">
                {selectedGroups.length > 0
                  ? `Groups: ${selectedGroups.length}`
                  : ""}
              </Badge>
              <Badge variant="secondary">
                {getActiveFilterCount() - selectedGroups.length > 0
                  ? `Filters: ${getActiveFilterCount() - selectedGroups.length}`
                  : ""}
              </Badge>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        align="end"
      >
        <FilterContent />
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilters;
