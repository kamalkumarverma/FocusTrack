import React from "react";
import { Calendar, Clock, Flag, CheckCircle, X } from "lucide-react";
import { format, isToday } from "date-fns";

const TaskDetails = ({ task, onClose }) => {
  const isCompleted = ["true", 1, "yes"].includes(
    typeof task.completed === "string" 
      ? task.completed.toLowerCase() 
      : task.completed
  );

  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700"
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-lg">
        {/* Header - Fixed */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                {task.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  priorityColors[task.priority?.toLowerCase()] || priorityColors.low
                }`}>
                  {task.priority || "Low"} Priority
                </span>
                <span className={`flex items-center gap-1 text-sm ${
                  isCompleted ? "text-green-600" : "text-gray-600"
                }`}>
                  {/* <CheckCircle className="w-4 h-4" />
                  {isCompleted ? "Completed" : "In Progress"} */}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description Section */}
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line text-gray-600">
                  {task.description}
                </p>
              </div>
            </div>
          )}

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${
                  task.dueDate && isToday(new Date(task.dueDate)) 
                    ? "text-fuchsia-600" 
                    : "text-gray-700"
                }`}>
                  {task.dueDate 
                    ? isToday(new Date(task.dueDate)) 
                      ? "Today" 
                      : format(new Date(task.dueDate), "dd MMM yyyy")
                    : "No due date"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-700">
                  {task.createdAt 
                    ? format(new Date(task.createdAt), "dd MMM yyyy") 
                    : "No date"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 border-t flex-shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;