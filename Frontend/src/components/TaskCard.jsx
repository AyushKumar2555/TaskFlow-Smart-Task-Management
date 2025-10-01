// TaskCard component - displays individual task with all details and actions
import { Edit2, Trash2, CheckCircle2, Clock, MapPin, Tag } from 'lucide-react';
import { formatDate, cn } from '../utils/myHelpers';

const TaskCard = ({ task, viewMode, onEdit, onDelete, onStatusChange, animationDelay = 0 }) => {
  // Safety check in case task data is missing
  if (!task) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-slate-700 rounded-full mt-2"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle quick completion of task
  const handleQuickComplete = () => {
    onStatusChange(task._id, 'completed');
  };

  // Get color based on task priority
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-amber-500', 
      low: 'bg-emerald-500'
    };
    return colors[priority] || colors.medium;
  };

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div 
      className={cn(
        "bg-slate-800 border border-slate-700 rounded-xl p-4 group hover:border-slate-600 transition-all duration-300",
        viewMode === 'list' && 'flex items-start gap-4',
        task.status === 'completed' && 'opacity-60',
        isOverdue && 'border-red-500/50 bg-red-500/10'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={cn("flex items-start gap-3", viewMode === 'list' && 'flex-1')}>
        {/* Priority indicator dot */}
        <div className={cn(
          "w-3 h-3 rounded-full mt-2 flex-shrink-0",
          getPriorityColor(task.priority)
        )} />
        
        {/* Main task content area */}
        <div className="flex-1 min-w-0">
          {/* Task header with title and description */}
          <div className="flex items-start gap-2 mb-3">
            <input 
              type="checkbox" 
              checked={task.status === 'completed'}
              onChange={() => onStatusChange(task._id, 
                task.status === 'completed' ? 'pending' : 'completed'
              )}
              className="w-4 h-4 text-teal-500 bg-slate-700 border-slate-600 rounded focus:ring-teal-500 focus:ring-1 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-white text-base leading-tight break-words",
                task.status === 'completed' && 'line-through text-slate-400'
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>

          {/* Task metadata - location, due date, tags */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            {/* Location information */}
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-teal-400" />
              {task.location || 'No location'}
            </span>

            {/* Due date information */}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
              {isOverdue && (
                <span className="text-red-400 ml-1 text-xs">• Overdue</span>
              )}
            </span>

            {/* Tags information */}
            {task.tags && task.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-purple-400" />
                {task.tags[0]}
                {task.tags.length > 1 && (
                  <span className="text-xs text-slate-500">+{task.tags.length - 1}</span>
                )}
              </span>
            )}
          </div>

          {/* Additional tags display */}
          {task.tags && task.tags.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(1, 4).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-md border border-slate-600"
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > 4 && (
                <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md border border-slate-600">
                  +{task.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons - appear on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
          {/* Quick complete button for incomplete tasks */}
          {task.status !== 'completed' && (
            <button
              onClick={handleQuickComplete}
              className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              title="Mark complete"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          {/* Edit task button */}
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {/* Delete task button */}
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status badge for list view */}
      {viewMode === 'list' && (
        <div className="flex-shrink-0">
          <span className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full border",
            task.status === 'completed' 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : task.status === 'in-progress'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
          )}>
            {task.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;