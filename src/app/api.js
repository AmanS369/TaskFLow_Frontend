import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let globalLoadingController = null;

export const setLoadingController = (controller) => {
  globalLoadingController = controller;
};
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (globalLoadingController?.setIsLoading) {
    globalLoadingController.setIsLoading(true);
  }
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (globalLoadingController?.setIsLoading) {
      globalLoadingController.setIsLoading(false);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("Refresh token missing");

        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        Cookies.set("accessToken", access, { secure: true, httpOnly: false });

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        if (globalLoadingController?.setIsLoading) {
          globalLoadingController.setIsLoading(false);
        }
        throw err;
      }
    }

    if (globalLoadingController?.setIsLoading) {
      globalLoadingController.setIsLoading(false);
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (userData) => {
    try {
      const response = await axiosInstance.post(`/auth/login/`, userData);

      const { access, refresh } = response.data.tokens;

      // Save tokens securely
      Cookies.set("accessToken", access, { secure: true });
      Cookies.set("refreshToken", refresh, { secure: true });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post(`/auth/register/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/user");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const TaskApi = {
  // Get task statistics
  getTaskStats: async () => {
    try {
      const response = await axiosInstance.get("/tasks/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tasks due today
  getTasksDueToday: async () => {
    try {
      const response = await axiosInstance.get("/tasks/due_today");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post("/tasks/", taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (task_id, taskData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task_id}/`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllTask: async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (task_id) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${task_id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all task groups
  getTaskGroups: async () => {
    try {
      const response = await axiosInstance.get("/task-groups");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new task group
  createTaskGroup: async (groupData) => {
    try {
      const response = await axiosInstance.post("/task-groups/", groupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTaskGroup: async (groupID, groupData) => {
    try {
      const response = await axiosInstance.put(
        `/task-groups/${groupID}/`,
        groupData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteTaskGroup: async (groupID) => {
    try {
      const response = await axiosInstance.delete(`/task-groups/${groupID}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tasks by group
  getTasksByGroup: async (groupId) => {
    try {
      const response = await axiosInstance.get(`/tasks/?group=${groupId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getGroupStats: async (groupID) => {
    try {
      const response = await axiosInstance.get(
        `/task-groups/${groupID}/group_stats`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default axiosInstance;
