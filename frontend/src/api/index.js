import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// ── Assignments ──────────────────────────────────────────────
export const getAssignments = (params) => API.get('/api/assignments', { params });
export const createAssignment = (data) => API.post('/api/assignments', data);
export const updateAssignment = (id, data) => API.put(`/api/assignments/${id}`, data);
export const deleteAssignment = (id) => API.delete(`/api/assignments/${id}`);

// ── Tasks ────────────────────────────────────────────────────
export const getTasks = () => API.get('/api/tasks');
export const createTask = (data) => API.post('/api/tasks', data);
export const updateTask = (id, data) => API.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/api/tasks/${id}`);

// ── Presentations ────────────────────────────────────────────
export const getPresentations = () => API.get('/api/presentations');
export const createPresentation = (data) => API.post('/api/presentations', data);
export const updatePresentation = (id, data) => API.put(`/api/presentations/${id}`, data);
export const deletePresentation = (id) => API.delete(`/api/presentations/${id}`);
