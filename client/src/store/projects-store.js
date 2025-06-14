import { create } from "zustand";
import apiClient from "@/lib/axios-setup";

const useProjectsStore = create((set, get) => ({
  // State
  projects: [],
  hackathonProjects: [],
  currentProject: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Portfolio Projects
  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/projects", projectData);
      const newProject = response;
      set((state) => ({
        projects: [newProject, ...state.projects],
        loading: false,
      }));

      return { success: true, data: newProject, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  getUserProjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/projects/user/${userId}`);
      const projects = response.data;
      set({ projects, loading: false });
      return { success: true, data: projects, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch projects";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateProject: async (projectId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(
        `/projects/${projectId}`,
        updateData
      );
      const updatedProject = response.data;

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? updatedProject : project
        ),
        loading: false,
      }));

      return { success: true, data: updatedProject, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/projects/${projectId}`);

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        loading: false,
      }));

      return { success: true, message: "Project deleted successfully" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Hackathon Projects
  createHackathonProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/projects/hackathon", projectData);
      const newProject = response.data;

      set((state) => ({
        hackathonProjects: [newProject, ...state.hackathonProjects],
        loading: false,
      }));

      return { success: true, data: newProject, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create hackathon project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  submitProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/projects/${projectId}/submit`);
      const submittedProject = response.data;

      set((state) => ({
        hackathonProjects: state.hackathonProjects.map((project) =>
          project.id === projectId ? submittedProject : project
        ),
        loading: false,
      }));

      return {
        success: true,
        data: submittedProject,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to submit project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  getHackathonProjects: async (hackathonId, status = "all", page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(
        `/projects/hackathon/${hackathonId}/all?status=${status}&page=${page}`
      );
      const { projects, pagination } = response.data;

      set({ hackathonProjects: projects, loading: false });
      return {
        success: true,
        data: projects,
        pagination,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch hackathon projects";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  getMyHackathonProjects: async (hackathonId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(
        `/projects/hackathon/${hackathonId}/my`
      );
      const { projects } = response.data;

      set({ hackathonProjects: projects, loading: false });
      return { success: true, data: projects, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to fetch your hackathon projects";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateHackathonProject: async (projectId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(
        `/projects/${projectId}/hackathon`,
        updateData
      );
      const updatedProject = response.data;

      set((state) => ({
        hackathonProjects: state.hackathonProjects.map((project) =>
          project.id === projectId ? updatedProject : project
        ),
        loading: false,
      }));

      return { success: true, data: updatedProject, message: response.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to update hackathon project";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  withdrawSubmission: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.put(`/projects/${projectId}/withdraw`);
      const withdrawnProject = response.data;

      set((state) => ({
        hackathonProjects: state.hackathonProjects.map((project) =>
          project.id === projectId ? withdrawnProject : project
        ),
        loading: false,
      }));

      return {
        success: true,
        data: withdrawnProject,
        message: response.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to withdraw submission";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Utility actions
  setCurrentProject: (project) => set({ currentProject: project }),
  clearProjects: () => set({ projects: [], hackathonProjects: [] }),
}));

export default useProjectsStore;
