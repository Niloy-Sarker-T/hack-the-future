import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/portfolio/ProfileHeader";
import ProfileSidebar from "../components/portfolio/ProfileSidebar";
import ProfileContent from "../components/portfolio/ProfileContent";
import useProfileStore from "../store/profileStore";

const Profile = () => {
  const { userId } = useParams();
  const {
    userData,
    projectsData,
    hackathonsData,
    achievementsData,
    isLoading,
    error,
    fetchUserProfile,
    fetchUserProjects,
    fetchUserHackathons,
    fetchUserAchievements,
  } = useProfileStore();

  useEffect(() => {
    // Fetch all profile data when component mounts
    // In a real implementation, these would be API calls with the userId
    fetchUserProfile(userId || "1");
    fetchUserProjects(userId || "1");
    fetchUserHackathons(userId || "1");
    fetchUserAchievements(userId || "1");
  }, [
    userId,
    fetchUserProfile,
    fetchUserProjects,
    fetchUserHackathons,
    fetchUserAchievements,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white flex items-center justify-center">
        <div className="text-[#14B8A6]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader userData={userData} />

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <ProfileSidebar userData={userData} />

          {/* Main Content */}
          <ProfileContent
            projectsData={projectsData}
            hackathonsData={hackathonsData}
            achievementsData={achievementsData}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;
