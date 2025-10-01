// TaskContext - manages task state and operations across the app
import { createContext, useContext, useState, useEffect } from 'react';
import { taskAPI } from '../utils/api';

// Create task management context
const TaskContext = createContext();

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

// Main task provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // Array of all tasks
  const [loading, setLoading] = useState(true); // Loading state for operations
  const [error, setError] = useState(null); // Error state for task operations

  // Fetch tasks from backend when component mounts
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // Only fetch tasks if user is authenticated
      if (!token) {
        setLoading(false);
        return;
      }

      // Get tasks data from API
      const tasksData = await taskAPI.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch tasks when the provider component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task and update the local state
  const createTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await taskAPI.createTask(taskData);
      // Add new task to the beginning of the tasks array
      setTasks(prev => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
      return { success: false, error: error.message };
    }
  };

  // Update an existing task
  const updateTask = async (id, taskData) => {
    try {
      setError(null);
      const updatedTask = await taskAPI.updateTask(id, taskData);
      // Replace the old task with updated one in the array
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
      return { success: false, error: error.message };
    }
  };

  // Delete a task by ID
  const deleteTask = async (id) => {
    try {
      setError(null);
      await taskAPI.deleteTask(id);
      // Remove the task from the local state
      setTasks(prev => prev.filter(task => task._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
      return { success: false, error: error.message };
    }
  };

  // Search tasks by title or description
  const searchTasks = (searchTerm) => {
    if (!searchTerm) return tasks;
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter tasks by their status
  const filterTasksByStatus = (status) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  };

  // Value provided to consumers of this context
  const value = {
    tasks,
    loading,
    error,
    fetchTasks, // Function to manually refresh tasks
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
    filterTasksByStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};