import apiClient from "./axios-setup";

class ApiService {
  // Auth endpoints
  async signup(userData) {
    return apiClient.post("/auth/register", userData);
  }

  async login(credentials) {
    return apiClient.post("/auth/login", credentials);
  }

  async logout() {
    return apiClient.post("/auth/logout");
  }

  //   async refreshToken() {
  //     return apiClient.post("/auth/refresh");
  //   }

  //   // User endpoints
  //   async getProfile() {
  //     return apiClient.get("/users/profile");
  //   }

  //   async updateProfile(userData) {
  //     return apiClient.put("/users/profile", userData);
  //   }

  //   // Hackathon endpoints
  //   async getHackathons() {
  //     return apiClient.get("/hackathons");
  //   }

  //   async getHackathon(id) {
  //     return apiClient.get(`/hackathons/${id}`);
  //   }

  //   async createHackathon(hackathonData) {
  //     return apiClient.post("/hackathons", hackathonData);
  //   }

  //   async joinHackathon(hackathonId) {
  //     return apiClient.post(`/hackathons/${hackathonId}/join`);
  //   }

  //   // Team endpoints
  //   async getTeams() {
  //     return apiClient.get("/teams");
  //   }

  //   async createTeam(teamData) {
  //     return apiClient.post("/teams", teamData);
  //   }

  //   async joinTeam(teamId) {
  //     return apiClient.post(`/teams/${teamId}/join`);
  //   }

  // Add more API methods as needed
}

export const apiService = new ApiService();
