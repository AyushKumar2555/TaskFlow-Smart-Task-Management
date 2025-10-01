// TaskFilters component - provides filtering and sorting options for tasks
import { useState, useRef, useEffect } from 'react';
import { Filter, X, SortAsc, Calendar, Flag, Clock, CheckCircle2 } from 'lucide-react';

const TaskFilters = ({ filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Predefined quick filter options for common use cases
  const quickFilters = [
    { 
      label: 'Due Today', 
      status: 'all', 
      priority: 'all', 
      sort: 'dueDate',
      icon: <Clock className="h-4 w-4 text-amber-400" />
    },
    { 
      label: 'High Priority', 
      status: 'all', 
      priority: 'high', 
      sort: '-createdAt',
      icon: <Flag className="h-4 w-4 text-red-400" />
    },
    { 
      label: 'In Progress', 
      status: 'in-progress', 
      priority: 'all', 
      sort: '-createdAt',
      icon: <Clock className="h-4 w-4 text-amber-400" />
    },
    { 
      label: 'Completed', 
      status: 'completed', 
      priority: 'all', 
      sort: '-createdAt',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    }
  ];

  // Apply a quick filter when user selects one
  const applyQuickFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      status: filter.status,
      priority: filter.priority,
      sort: filter.sort
    }));
    setShowFilters(false);
  };

  // Reset all filters to default values
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sort: '-createdAt'
    });
    setShowFilters(false);
  };

  // Check if any filters are currently active
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.sort !== '-createdAt';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main filters button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          hasActiveFilters ? 'ring-2 ring-amber-400' : ''
        }`}
      >
        <Filter className="h-4 w-4" />
        Filters
        {/* Show dot indicator when filters are active */}
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Filters dropdown menu */}
      {showFilters && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl p-6 z-50 shadow-xl animate-scale-in">
          <div className="space-y-6">
            {/* Header section with title and close button */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-400" />
                Filters & Sort
              </h4>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick filters section for common filter combinations */}
            <div>
              <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-teal-400" />
                Quick Filters
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {quickFilters.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => applyQuickFilter(filter)}
                    className="text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2"
                  >
                    {filter.icon}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                <option value="all" className="bg-slate-800">All Statuses</option>
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="in-progress" className="bg-slate-800">In Progress</option>
                <option value="completed" className="bg-slate-800">Completed</option>
              </select>
            </div>

            {/* Priority filter dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Flag className="h-4 w-4 text-amber-400" />
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                <option value="all" className="bg-slate-800">All Priorities</option>
                <option value="low" className="bg-slate-800">Low</option>
                <option value="medium" className="bg-slate-800">Medium</option>
                <option value="high" className="bg-slate-800">High</option>
              </select>
            </div>

            {/* Sort options dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-teal-400" />
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              >
                <option value="-createdAt" className="bg-slate-800">Newest First</option>
                <option value="createdAt" className="bg-slate-800">Oldest First</option>
                <option value="title" className="bg-slate-800">Title A-Z</option>
                <option value="-title" className="bg-slate-800">Title Z-A</option>
                <option value="dueDate" className="bg-slate-800">Due Date</option>
                <option value="-dueDate" className="bg-slate-800">Due Date (Latest)</option>
              </select>
            </div>

            {/* Clear all filters button */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;