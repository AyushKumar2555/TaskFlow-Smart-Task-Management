// Dashboard component - main task management interface
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { formatDate, cn } from '../utils/myHelpers';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import { DashboardSkeleton, TaskCardSkeleton } from '../components/LoadingSkeleton';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelp from '../components/KeyboardShortcutsHelp';

const Dashboard = () => {
  // Get task data and functions from context
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTask();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sort: '-createdAt'
  });

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Fetch tasks when filters change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  // Task management functions
  const handleCreateTask = async (taskData) => {
    try {
      const result = await createTask(taskData);
      if (result.success) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      const result = await updateTask(editingTask._id, taskData);
      if (result.success) {
        setShowModal(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Calculate task statistics with safety checks
  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t?.status === 'completed').length || 0,
    inProgress: tasks?.filter(t => t?.status === 'in-progress').length || 0,
    dueToday: tasks?.filter(t => {
      if (!t?.dueDate) return false;
      return new Date(t.dueDate).toDateString() === new Date().toDateString();
    }).length || 0,
    overdue: tasks?.filter(t => {
      if (!t?.dueDate || t?.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length || 0
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Custom SVG icons for statistics cards
  const CheckIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const ProgressIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const TodayIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const AlertIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  // Show loading skeleton on initial load
  if (loading && tasks.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Completed Tasks Card */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-500 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckIcon />
                </div>
                <span className="text-slate-300 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.completed}/{stats.total}</div>
              <div className="text-xs text-slate-400">{completionRate}% done</div>
            </div>

            {/* In Progress Tasks Card */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-amber-500 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <ProgressIcon />
                </div>
                <span className="text-slate-300 text-sm">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
              <div className="text-xs text-slate-400">active</div>
            </div>

            {/* Due Today Tasks Card */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-teal-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <TodayIcon />
                </div>
                <span className="text-slate-300 text-sm">Due Today</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.dueToday}</div>
              <div className="text-xs text-slate-400">urgent</div>
            </div>

            {/* Overdue Tasks Card */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-red-500 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertIcon />
                </div>
                <span className="text-slate-300 text-sm">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.overdue}</div>
              <div className="text-xs text-slate-400">attention</div>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks (Ctrl+K)..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-11 pr-20 py-3 text-white placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded border border-slate-500 hidden md:inline-block">
                Ctrl+K
              </kbd>
            </div>
            <div className="flex gap-2">
              <TaskFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>

        {/* Tasks Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Today's Priority Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Task
            <kbd className="ml-2 px-2 py-1 text-xs bg-teal-600 text-white rounded border border-teal-500 hidden md:inline-block">
              Ctrl+N
            </kbd>
          </button>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 && !loading ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No tasks yet</h3>
              <p className="text-slate-400 text-lg mb-6">Start organizing your work by creating your first task</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Create Your First Task
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Show loading skeletons when refreshing with existing tasks */}
            {loading && tasks.length > 0 && (
              <>
                {[...Array(3)].map((_, i) => (
                  <TaskCardSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            )}
            
            {/* Render actual tasks */}
            {tasks.map((task, index) => (
              task && ( // Safety check for undefined tasks
                <div key={task._id || index} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Priority indicator dot */}
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    
                    {/* Task content area */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="checkbox" 
                          checked={task.status === 'completed'}
                          onChange={() => handleStatusChange(task._id, 
                            task.status === 'completed' ? 'pending' : 'completed'
                          )}
                          className="w-4 h-4 text-teal-500 bg-slate-700 border-slate-600 rounded focus:ring-teal-500"
                        />
                        <span className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </span>
                      </div>
                      
                      {/* Task metadata */}
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {task.location || 'No location'}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {task.tags?.[0] || 'No tags'}
                        </span>
                      </div>
                    </div>

                    {/* Task action buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Task creation/editing modal */}
        {showModal && (
          <TaskModal
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Keyboard shortcuts help modal */}
        <KeyboardShortcutsHelp />
      </div>
    </div>
  );
};

export default Dashboard;
