import { create } from "zustand";
import apiClient from "@/lib/axios-setup";

const useHackathonStore = create((set) => ({
  hackathons: [],
  total: 0,
  loading: false,
  filters: { search: "", themes: [], status: "" },
  page: 1,
  pageSize: 9,

  setFilters: (filters) => set({ filters, page: 1 }),
  setPage: (page) => set({ page }),

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
        total: res.total || 0,
        loading: false,
      });
    } catch (e) {
      set({ hackathons: [], total: 0, loading: false });
    }
  },

  updateHackathons: async (hackathon) => {
    //this function call api to update hackathons
    set({ loading: true });
    try {
      // api hit to hackathons/:hackathonId
      // this will update the hackathons in the database
      const res = await apiClient.put(`/hackathons/${hackathon.id}`, {
        hackathon,
      });
      if (res.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      set({ loading: false });
    }
  },

  // get hackathon by id
  getHackathonById: async (id) => {
    set({ loading: true });
    try {
      const res = await apiClient.get(`/hackathons/${id}`);
      set({ loading: false });
      return res.data;
    } catch (e) {
      set({ loading: false });
      throw e; // rethrow to handle in component
    }
  },
}));

export default useHackathonStore;
