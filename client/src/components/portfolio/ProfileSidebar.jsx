import { Edit2, Code, Calendar, Award, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AboutSection = ({ bio }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <h2 className="text-lg font-semibold mb-4">About</h2>
    <p className="text-gray-300">{bio}</p>
  </div>
);

const SkillsSection = ({ skills }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Skills</h2>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-[#14B8A6] hover:text-[#0E9384]"
      >
        <Edit2 className="h-4 w-4 mr-1" />
        Edit
      </Button>
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

const InterestsSection = ({ interests }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">Interests</h2>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-[#14B8A6] hover:text-[#0E9384]"
      >
        <Edit2 className="h-4 w-4 mr-1" />
        Edit
      </Button>
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

const StatsSection = ({ stats }) => (
  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
    <h2 className="text-lg font-semibold mb-4">Stats</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Code className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.projects}</span>
        <span className="text-xs text-gray-400">Projects</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Calendar className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.hackathons}</span>
        <span className="text-xs text-gray-400">Hackathons</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Award className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.achievements}</span>
        <span className="text-xs text-gray-400">Achievements</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Heart className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.likes}</span>
        <span className="text-xs text-gray-400">Likes</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Users className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.followers}</span>
        <span className="text-xs text-gray-400">Followers</span>
      </div>
      <div className="flex flex-col items-center p-3 bg-[#121212] rounded-lg">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14B8A6]/10 mb-2">
          <Users className="h-5 w-5 text-[#14B8A6]" />
        </div>
        <span className="text-xl font-bold">{stats.following}</span>
        <span className="text-xs text-gray-400">Following</span>
      </div>
    </div>
  </div>
);

const ProfileSidebar = ({ userData }) => {
  return (
    <div className="md:col-span-1 space-y-6">
      <AboutSection bio={userData.bio} />
      <SkillsSection skills={userData.skills} />
      <InterestsSection interests={userData.interests} />
      <StatsSection stats={userData.stats} />
    </div>
  );
};

export default ProfileSidebar;
