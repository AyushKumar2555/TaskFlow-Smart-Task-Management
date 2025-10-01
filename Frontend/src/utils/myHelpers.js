// src/utils/myHelpers.js

// This function takes a date string and returns it in a nice readable format (e.g., "Oct 2, 2025")
export const formatDate = (dateString) => {
  // If no date is provided, return a default message
  if (!dateString) return 'No date';
  
  // Convert the string into a Date object
  const date = new Date(dateString);

  // Format the date as "Month Day, Year" (US style)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// This helper combines multiple class names into a single string
// It ignores any falsey values (like null, undefined, false, etc.)
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
