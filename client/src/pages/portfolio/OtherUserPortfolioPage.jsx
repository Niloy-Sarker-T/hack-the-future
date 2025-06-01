import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiService } from "@/lib/api-services";
import UserNotFound from "@/components/portfolio/user-not-found";
import LoadingIndicator from "@/components/ui/loading-indicator";
import UserProfileCard from "@/components/portfolio/UserProfileCard";
import UserSkills from "@/components/portfolio/UserSkills";
import UserInterests from "@/components/portfolio/UserInterests";
import UserStatistics from "@/components/portfolio/UserStatistics";

export default function OtherUserPortfolioPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setError("");
        const userData = await apiService.getUserByUsername(username);
        setUser(userData);
      } catch (error) {
        // Check for API error structure
        if (error.response && error.response.data) {
          setError(error.response.data.message || "User doesn't exists.");
        } else {
          setError(error.message || "Failed to fetch user profile.");
        }
        setUser(null);
      }
    };
    fetchUserProfile();

    return () => {
      setUser(null);
      setError("");
    };
  }, [username]);

  if (error) {
    return <UserNotFound />;
  }

  if (!user) {
    return (
      <LoadingIndicator message="Loading user profile..." fullScreen={true} />
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 md:row-span-2 flex flex-col items-center gap-6">
          <UserProfileCard user={user} />
        </aside>
        <main className="md:col-span-2 flex flex-col gap-8">
          <UserSkills skills={user.skills} />
          <UserInterests interests={user.interests} />
        </main>
      </div>
      <section>
        <UserStatistics username={username} statistics={user.statistics} />
      </section>
    </div>
  );
}
