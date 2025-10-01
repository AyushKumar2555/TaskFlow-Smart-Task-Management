import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create a reusable axios instance with some default settings
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Before every request, attach the token (if it exists) so the user stays logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// If the server says the token is invalid (401), log the user out and send them to login page
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication related requests (login, signup, profile)
export const authAPI = {
  // Send login request with email and password
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then(res => res.data),

  // Register a new user with given details
  register: (userData) =>
    apiClient.post('/auth/register', userData).then(res => res.data),

  // Get current logged-in user profile
  getProfile: () =>
    apiClient.get('/auth/profile').then(res => res.data),
};

// Task related requests (CRUD operations for tasks)
export const taskAPI = {
  // Get all tasks
  getTasks: () => 
    apiClient.get('/tasks').then(res => res.data),
  
  // Create a new task
  createTask: (taskData) => 
    apiClient.post('/tasks', taskData).then(res => res.data),
  
  // Update an existing task by id
  updateTask: (id, taskData) => 
    apiClient.put(`/tasks/${id}`, taskData).then(res => res.data),
  
  // Delete a task by id
  deleteTask: (id) => 
    apiClient.delete(`/tasks/${id}`).then(res => res.data),
};

export default apiClient;
