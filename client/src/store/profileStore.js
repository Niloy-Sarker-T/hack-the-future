import { create } from "zustand";

// Mock data for initial state
const initialState = {
  userData: {
    id: "1",
    name: "Tanvir Ahmed",
    username: "@tanvir-ahmed",
    avatar: "/placeholder.svg?height=200&width=200",
    location: "Dhaka, Bangladesh",
    bio: "Full-stack developer passionate about building innovative solutions. I love participating in hackathons and collaborating with talented individuals.",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "TypeScript",
      "Next.js",
      "TailwindCSS",
    ],
    interests: [
      "Web Development",
      "AI/ML",
      "Fintech",
      "IoT",
      "Mobile",
      "Blockchain",
      "UI/UX Design",
      "Cloud Computing",
      "Open Source",
    ],
    socialLinks: {
      github: "https://github.com/tanvir-ahmed",
      linkedin: "https://linkedin.com/in/tanvir-ahmed",
      twitter: "https://twitter.com/tanvir_ahmed",
      website: "https://tanvirahmed.dev",
    },
    stats: {
      projects: 5,
      hackathons: 7,
      achievements: 3,
      followers: 42,
      following: 38,
      likes: 126,
    },
  },
  projectsData: [
    {
      id: "1",
      title: "EcoTrack",
      description:
        "A sustainability tracking platform that helps users monitor their carbon footprint and suggests eco-friendly alternatives.",
      image: "/placeholder.svg?height=150&width=250",
      tags: ["React", "Node.js", "MongoDB", "TailwindCSS"],
      hackathon: "Green Tech Hackathon 2024",
      likes: 48,
    },
    {
      id: "2",
      title: "FinLiteracy",
      description:
        "An educational platform that teaches financial literacy to young adults through interactive games and challenges.",
      image: "/placeholder.svg?height=150&width=250",
      tags: ["Next.js", "TypeScript", "Supabase", "Framer Motion"],
      hackathon: "Fintech Innovation Challenge",
      likes: 36,
    },
    {
      id: "3",
      title: "MediConnect",
      description:
        "A telemedicine solution that connects patients in rural areas with healthcare professionals through low-bandwidth video calls.",
      image: "/placeholder.svg?height=150&width=250",
      tags: ["React Native", "Firebase", "WebRTC", "Express.js"],
      hackathon: "Healthcare Hackathon 2023",
      likes: 52,
    },
  ],
  hackathonsData: [
    {
      id: "1",
      name: "Green Tech Hackathon 2024",
      date: "March 15-17, 2024",
      position: "Winner",
      project: "EcoTrack",
      image: "/placeholder.svg?height=80&width=150",
    },
    {
      id: "2",
      name: "Fintech Innovation Challenge",
      date: "January 5-7, 2024",
      position: "Runner-up",
      project: "FinLiteracy",
      image: "/placeholder.svg?height=80&width=150",
    },
    {
      id: "3",
      name: "Healthcare Hackathon 2023",
      date: "November 10-12, 2023",
      position: "Top 5",
      project: "MediConnect",
      image: "/placeholder.svg?height=80&width=150",
    },
    {
      id: "4",
      name: "AI for Social Good",
      date: "September 22-24, 2023",
      position: "Participant",
      project: "EduBot",
      image: "/placeholder.svg?height=80&width=150",
    },
  ],
  achievementsData: [
    {
      id: "1",
      title: "Hackathon Champion",
      description: "Won first place at Green Tech Hackathon 2024",
      date: "March 2024",
      icon: "trophy",
    },
    {
      id: "2",
      title: "Innovation Award",
      description:
        "Received the Most Innovative Solution award at Fintech Innovation Challenge",
      date: "January 2024",
      icon: "innovation",
    },
    {
      id: "3",
      title: "Community Contributor",
      description:
        "Recognized for outstanding contributions to the hack-the-future community",
      date: "February 2024",
      icon: "community",
    },
  ],
  isLoading: false,
  error: null,
};

// Create the store
const useProfileStore = create((set) => ({
  ...initialState,

  // Actions
  fetchUserProfile: async (userId) => {
    // Example of how you would implement API fetching
    try {
      set({ isLoading: true, error: null });

      // This would be replaced with actual API call:
      // const response = await fetch(`/api/users/${userId}`);
      // if (!response.ok) throw new Error('Failed to fetch user profile');
      // const userData = await response.json();

      // For now, just simulate a delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the store with fetched data
      set({ userData: initialState.userData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserProfileByUsername: async (username) => {
    // Example of how you would implement API fetching by username
    try {
      set({ isLoading: true, error: null });

      // This would be replaced with actual API call:
      // const response = await fetch(`/api/users/by-username/${username}`);
      // if (!response.ok) throw new Error('Failed to fetch user profile');
      // const userData = await response.json();

      // For now, just simulate a delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real application, this would be filtered by username from the API
      // For now, we're just returning the mock data
      set({ userData: initialState.userData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserProjects: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ projectsData: initialState.projectsData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserHackathons: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ hackathonsData: initialState.hackathonsData, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserAchievements: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        achievementsData: initialState.achievementsData,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      // This would be replaced with actual API call:
      // const response = await fetch(`/api/users/${userData.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // if (!response.ok) throw new Error('Failed to update profile');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      set((state) => ({
        userData: { ...state.userData, ...userData },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Project actions
  addProject: async (project) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        projectsData: [
          ...state.projectsData,
          { ...project, id: Date.now().toString() },
        ],
        userData: {
          ...state.userData,
          stats: {
            ...state.userData.stats,
            projects: state.userData.stats.projects + 1,
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  likeProject: async (projectId) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        projectsData: state.projectsData.map((project) =>
          project.id === projectId
            ? { ...project, likes: project.likes + 1 }
            : project
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useProfileStore;
