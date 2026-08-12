import { axiosClient } from '../api/axiosClient';

export const taskService = {
  getTasks: async () => {
    const { data } = await axiosClient.get('/tasks');
    return data;
  },

  createTask: async (taskData) => {
    const { data } = await axiosClient.post('/tasks', taskData);
    return data;
  },

  updateTask: async ({ id, ...taskData }) => {
    const { data } = await axiosClient.put(`/tasks/${id}`, taskData);
    return data;
  },

  deleteTask: async (id) => {
    await axiosClient.delete(`/tasks/${id}`);
    return id;
  },
};