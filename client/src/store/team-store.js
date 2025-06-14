import { create } from "zustand";
import apiClient from "@/lib/axios-setup";

const useTeamStore = create((set, get) => ({
  // State
  currentTeam: null,
  teams: [],
  participants: [],
  loading: false,
  error: null,

  // Actions
  setCurrentTeam: (team) => set({ currentTeam: team }),
  setTeams: (teams) => set({ teams }),
  setParticipants: (participants) => set({ participants }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Team CRUD operations
  createTeam: async (teamData) => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.post("/teams", teamData);
      const team = response.data;

      set((state) => ({
        teams: [...state.teams, team],
        currentTeam: team,
        loading: false,
      }));

      return { success: true, data: team };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  getTeam: async (teamId) => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.get(`/teams/${teamId}`);
      const team = response.data;

      set({ currentTeam: team, loading: false });
      return { success: true, data: team };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateTeam: async (teamId, updates) => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.put(`/teams/${teamId}`, updates);
      const updatedTeam = response.data;

      set((state) => ({
        currentTeam:
          state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
        teams: state.teams.map((team) =>
          team.id === teamId ? updatedTeam : team
        ),
        loading: false,
      }));

      return { success: true, data: updatedTeam };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deleteTeam: async (teamId) => {
    try {
      set({ loading: true, error: null });
      await apiClient.delete(`/teams/${teamId}`);

      set((state) => ({
        teams: state.teams.filter((team) => team.id !== teamId),
        currentTeam:
          state.currentTeam?.id === teamId ? null : state.currentTeam,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Team membership operations
  joinTeam: async (teamId) => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.post(`/teams/${teamId}/join`);

      // Refresh team data
      await get().getTeam(teamId);

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to join team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  leaveTeam: async (teamId) => {
    try {
      set({ loading: true, error: null });
      await apiClient.delete(`/teams/${teamId}/leave`);

      set((state) => ({
        currentTeam:
          state.currentTeam?.id === teamId ? null : state.currentTeam,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to leave team";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  removeMember: async (teamId, userId) => {
    try {
      set({ loading: true, error: null });
      await apiClient.delete(`/teams/${teamId}/members/${userId}`);

      // Refresh team data
      await get().getTeam(teamId);

      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove member";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  transferLeadership: async (teamId, userId) => {
    try {
      set({ loading: true, error: null });
      await apiClient.put(`/teams/${teamId}/transfer/${userId}`);

      // Refresh team data
      await get().getTeam(teamId);

      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to transfer leadership";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Team discovery
  getTeamsByHackathon: async (hackathonId, params = {}) => {
    try {
      set({ loading: true, error: null });
      console.log("Fetching teams for hackathon:", hackathonId);
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(
        `/teams/hackathon/${hackathonId}${queryParams ? `?${queryParams}` : ""}`
      );
      console.log("API response:", response.data);

      // The API returns { success: true, data: teams, message: "..." }
      const teams = response.data.data || response.data;
      console.log("Teams extracted:", teams);

      set({ teams, loading: false });
      return { success: true, data: teams };
    } catch (error) {
      console.error("Error fetching teams:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch teams";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  searchTeams: async (hackathonId, filters = {}) => {
    try {
      set({ loading: true, error: null });
      const queryParams = new URLSearchParams({
        hackathonId,
        ...filters,
      }).toString();
      const response = await apiClient.get(`/teams/search?${queryParams}`);
      const teams = response.data.teams;

      set({ teams, loading: false });
      return { success: true, data: teams };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to search teams";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  getUserTeams: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.get("/teams/user/my-teams");
      const teams = response.data;

      set({ teams, loading: false });
      return { success: true, data: teams };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user teams";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Participant discovery
  getAvailableParticipants: async (hackathonId, filters = {}) => {
    try {
      set({ loading: true, error: null });

      const queryParams = new URLSearchParams({ ...filters }).toString();
      const response = await apiClient.get(
        `/hackathon-registration/${hackathonId}/available-participants${
          queryParams ? `?${queryParams}` : ""
        }`
      );
      const participants = response.data.data || response.data;

      set({ participants, loading: false });
      return { success: true, data: participants };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch available participants";
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Clear state
  clearTeamData: () =>
    set({
      currentTeam: null,
      teams: [],
      participants: [],
      error: null,
    }),

  clearError: () => set({ error: null }),
}));

export default useTeamStore;
