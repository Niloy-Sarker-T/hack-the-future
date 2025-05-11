import { Edit2, MapPin, Github, Linkedin, Twitter, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileHeader = ({ userData }) => {
  return (
    <div className="relative mb-8">
      {/* Cover Image */}
      <div className="h-48 md:h-64 rounded-lg bg-gradient-to-r from-[#0F766E] to-[#134E4A] overflow-hidden">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 backdrop-blur-sm border-white/20 text-white"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#121212] overflow-hidden">
            <img
              src={userData.avatar || "/placeholder.svg"}
              alt={userData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#14B8A6] flex items-center justify-center text-white hover:bg-[#0E9384] transition-colors">
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 pt-4 md:pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {userData.name}
              </h1>
              <p className="text-gray-400">{userData.username}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#2A2A2A] backdrop-blur-sm  bg-[#2A2A2A] text-white"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white">
                <Edit2 className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>

          {/* Location and Social Links */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {userData.location && (
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-1 text-[#14B8A6]" />
                <span>{userData.location}</span>
              </div>
            )}

            {userData.socialLinks.github && (
              <a
                href={userData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-[#14B8A6] transition-colors"
              >
                <Github className="h-4 w-4 mr-1" />
                <span>GitHub</span>
              </a>
            )}

            {userData.socialLinks.linkedin && (
              <a
                href={userData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-[#14B8A6] transition-colors"
              >
                <Linkedin className="h-4 w-4 mr-1" />
                <span>LinkedIn</span>
              </a>
            )}

            {userData.socialLinks.twitter && (
              <a
                href={userData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-[#14B8A6] transition-colors"
              >
                <Twitter className="h-4 w-4 mr-1" />
                <span>Twitter</span>
              </a>
            )}

            {userData.socialLinks.website && (
              <a
                href={userData.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-[#14B8A6] transition-colors"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
