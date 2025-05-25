import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileStats from "./ProfileStats";
import ProfileSocialLinks from "./ProfileSocialLinks";

const AboutSection = ({ bio }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <h2 className="text-lg font-semibold mb-4">About</h2>
    <p className="text-gray-300">{bio}</p>
  </div>
);

const SkillsSection = ({ skills, showEditOptions = true }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Skills</h2>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge
          key={skill}
          className="bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/20"
        >
          {skill}
        </Badge>
      ))}
    </div>
  </div>
);

const InterestsSection = ({ interests, showEditOptions = true }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Interests</h2>
    </div>
    <div className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <Badge
          key={interest}
          variant="outline"
          className="border-[#2A2A2A] bg-[#121212] hover:bg-[#2A2A2A] text-gray-300"
        >
          {interest}
        </Badge>
      ))}
    </div>
  </div>
);

const StatsSection = ({ stats, showEditOptions = true }) => (
  <ProfileStats
    stats={stats}
    // showEditOptions={showEditOptions}
    // onStatClick={(statKey) => {
    //   // Handle stat click - could navigate to filtered views
    //   console.log(`Clicked on ${statKey} stat`);
    // }}
  />
);

const ProfileSidebar = ({ userData, showEditOptions = true }) => {
  return (
    <div className="md:col-span-1 space-y-6">
      <AboutSection bio={userData.bio} />
      <SkillsSection
        skills={userData.skills}
        // showEditOptions={showEditOptions}
      />
      <InterestsSection
        interests={userData.interests}
        // showEditOptions={showEditOptions}
      />
      <StatsSection stats={userData.stats} />
    </div>
  );
};

export default ProfileSidebar;
