import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../../components/portfolio/ProfileHeader";
import ProfileSidebar from "../../components/portfolio/ProfileSidebar";
import ProfileContent from "../../components/portfolio/ProfileContent";
import ProfileLoading from "../../components/portfolio/ProfileLoading";
import ProfileError from "../../components/portfolio/ProfileError";
import useProfileStore from "../../store/profileStore";

const ProfilePreview = () => {
  const { userName } = useParams();
  const {
    userData,
    projectsData,
    hackathonsData,
    achievementsData,
    isLoading,
    error,
    fetchUserProfileByUsername,
    fetchUserProjects,
    fetchUserHackathons,
    fetchUserAchievements,
  } = useProfileStore();

  useEffect(() => {
    // In a real implementation, these would be API calls using the username
    // For now we'll use the mock data but in production you would
    // fetch data based on the username parameter (without the @ symbol if present)
    const formattedUsername = userName?.startsWith("@")
      ? userName.substring(1)
      : userName;

    // Fetch user by username instead of ID
    fetchUserProfileByUsername(formattedUsername);

    // Once we have the user's ID from the profile data
    if (userData?.id) {
      fetchUserProjects(userData.id);
      fetchUserHackathons(userData.id);
      fetchUserAchievements(userData.id);
    }
  }, [
    userName,
    userData?.id,
    fetchUserProfileByUsername,
    fetchUserProjects,
    fetchUserHackathons,
    fetchUserAchievements,
  ]);

  const handleRetry = () => {
    // Retry fetching profile data
    const formattedUsername = userName?.startsWith("@")
      ? userName.substring(1)
      : userName;
    fetchUserProfileByUsername(formattedUsername);
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (error) {
    return (
      <ProfileError
        error={error}
        onRetry={handleRetry}
        type={error.includes("not found") ? "user-not-found" : "general"}
      />
    );
  }

  // If user not found
  if (!userData) {
    return (
      <ProfileError
        error="User not found"
        onRetry={handleRetry}
        type="user-not-found"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <main className="container mx-auto px-4 py-8">
        {/* <ProfileBreadcrumb userData={userData} isPreview={true} /> */}
        {/* Pass showEditOptions={false} to hide edit buttons */}
        <ProfileHeader userData={userData} showEditOptions={false} />

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <ProfileSidebar userData={userData} showEditOptions={false} />

          {/* Main Content */}
          <ProfileContent
            projectsData={projectsData}
            hackathonsData={hackathonsData}
            achievementsData={achievementsData}
            showEditOptions={false}
          />
        </div>
      </main>
    </div>
  );
};

export default ProfilePreview;
