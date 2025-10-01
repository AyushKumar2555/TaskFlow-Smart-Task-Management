// Loading skeleton components for better user experience
// Shows placeholder content while data is loading

// Skeleton for the main dashboard page
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-900 text-white p-8">
    <div className="max-w-7xl mx-auto">
      {/* Page title skeleton */}
      <div className="h-8 bg-slate-800 rounded w-48 mb-8 animate-pulse"></div>
      
      {/* Stats cards skeleton - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-12 mb-1"></div>
            <div className="h-3 bg-slate-700 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Tasks section skeleton */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-40 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-64 mb-4"></div>
        <div className="h-10 bg-slate-700 rounded w-32"></div>
      </div>
    </div>
  </div>
);

// Skeleton for individual task cards
export const TaskCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
    <div className="flex items-start gap-3">
      {/* Priority dot skeleton */}
      <div className="w-3 h-3 bg-slate-700 rounded-full mt-2"></div>
      
      {/* Task content skeleton */}
      <div className="flex-1">
        {/* Checkbox and title skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-48"></div>
        </div>
        
        {/* Task metadata skeleton */}
        <div className="flex gap-4">
          <div className="h-3 bg-slate-700 rounded w-24"></div>
          <div className="h-3 bg-slate-700 rounded w-20"></div>
          <div className="h-3 bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);