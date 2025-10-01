// TaskModal component - form for creating and editing tasks
import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Tag, Flag, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

const TaskModal = ({ task, onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!task; // Check if we're editing an existing task

  // Initialize form with react-hook-form
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      location: '',
      tags: ''
    }
  });

  const currentPriority = watch('priority'); // Watch priority for real-time updates

  // Reset form when task data changes (for editing)
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        location: task.location || '',
        tags: task.tags?.join(', ') || ''
      });
    }
  }, [task, reset]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      // Format tags from comma-separated string to array
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      await onSubmit(formattedData);
    } catch (error) {
      console.log('Form submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get color class based on priority level
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-amber-500',
      low: 'text-emerald-500'
    };
    return colors[priority] || colors.medium;
  };

  // Get priority indicator dot
  const getPriorityDot = (priority) => {
    return (
      <div className={`w-3 h-3 rounded-full ${
        priority === 'high' ? 'bg-red-500' :
        priority === 'medium' ? 'bg-amber-500' :
        'bg-emerald-500'
      }`} />
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal content container */}
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle bg-slate-800 border border-slate-700 rounded-2xl transform transition-all">
          
          {/* Modal header with title and close button */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {isEditing ? 'Update your task details' : 'Add a new task to your list'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Task form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Task title field - required */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Task Title *
              </label>
              <input
                type="text"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title should be at least 3 characters'
                  }
                })}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="What needs to be done?"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Task description field - optional */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Description
              </label>
              <textarea
                rows={4}
                {...register('description')}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
                placeholder="Add some details about this task..."
              />
            </div>

            {/* Status and priority selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Status
                </label>
                <select 
                  {...register('status')} 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="in-progress" className="bg-slate-800">In Progress</option>
                  <option value="completed" className="bg-slate-800">Completed</option>
                </select>
              </div>

              {/* Priority dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Flag className="h-4 w-4 text-amber-400" />
                  Priority
                </label>
                <select 
                  {...register('priority')} 
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="low" className="bg-slate-800">Low</option>
                  <option value="medium" className="bg-slate-800">Medium</option>
                  <option value="high" className="bg-slate-800">High</option>
                </select>
                
                {/* Priority visual indicator */}
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                  {getPriorityDot(currentPriority)}
                  <span className="capitalize">{currentPriority} priority</span>
                </div>
              </div>
            </div>

            {/* Due date and location fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due date picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-400" />
                  Due Date
                </label>
                <input
                  type="date"
                  {...register('dueDate')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>

              {/* Location input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-400" />
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  placeholder="Where is this task?"
                />
              </div>
            </div>

            {/* Tags input field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-400" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="work, urgent, personal"
              />
              <p className="text-xs text-slate-500 mt-2">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Form action buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {isEditing ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;