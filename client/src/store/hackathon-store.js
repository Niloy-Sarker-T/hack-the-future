import { create } from "zustand";
import apiClient from "@/lib/axios-setup";

const useHackathonStore = create((set, get) => ({
  hackathons: [],
  total: 0,
  loading: false,
  filters: { search: "", themes: [], status: "" },
  page: 1,
  pageSize: 10,
  currentHackathon: null,

  setFilters: (filters) => set({ filters, page: 1 }),
  setPage: (page) => set({ page }),
  setCurrentHackathon: (hackathon) => set({ currentHackathon: hackathon }),

  fetchHackathons: async () => {
    set({ loading: true });
    try {
      const { filters, page, pageSize } = useHackathonStore.getState();
      const params = {
        page,
        limit: pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.themes.length > 0 && { themes: filters.themes }),
      };
      const res = await apiClient.get("/hackathons", { params });
      set({
        hackathons: res.data.hackathons || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        pageSize: res.data.pageSize || 10,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching hackathons:", error);
      set({ hackathons: [], total: 0, loading: false });
    }
  },

  updateHackathon: async (hackathonId, data) => {
    set({ loading: true });
    try {
      const res = await apiClient.put(`/hackathons/${hackathonId}`, data);
      if (res.success) {
        set({ loading: false });
        return { success: true, data: res.data, message: res.message };
      } else {
        throw new Error("Failed to update hackathon");
      }
    } catch (error) {
      console.error("Error updating hackathon:", error);
      set({ loading: false });
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  uploadImage: async (file, type, hackathonId) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const res = await apiClient.post(
        `/hackathons/${hackathonId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.success) {
        set({ loading: false });
        return { success: true, data: res.data, message: res.message };
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  // get hackathon by id
  getHackathonById: async (id) => {
    set({ loading: true });
    try {
      const res = await apiClient.get(`/hackathons/${id}`);
      set({ loading: false });
      if (!res.data) {
        throw new Error("Hackathon not found");
      }
      return { success: true, data: res.data, message: res.message };
    } catch (e) {
      set({ loading: false });
      throw e; // rethrow to handle in component
    }
  },
}));

export default useHackathonStore;
