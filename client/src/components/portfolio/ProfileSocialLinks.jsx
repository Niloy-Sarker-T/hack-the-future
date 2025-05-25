import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  Plus,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SocialLink = ({ href, icon: Icon, label, color = "#14B8A6" }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#121212] border border-[#2A2A2A] transition-all duration-300 hover:border-[${color}] group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className={`h-4 w-4 transition-colors duration-300 ${
          isHovered ? "text-[#14B8A6]" : "text-gray-400"
        }`}
        style={{ color: isHovered ? color : undefined }}
      />
      <span
        className={`text-sm transition-colors duration-300 ${
          isHovered ? "text-white" : "text-gray-300"
        }`}
      >
        {label}
      </span>
      <ExternalLink
        className={`h-3 w-3 transition-all duration-300 ${
          isHovered ? "opacity-100 transform translate-x-1" : "opacity-0"
        }`}
      />
    </a>
  );
};

const ProfileSocialLinks = ({
  socialLinks,
  showEditOptions = true,
  onEdit,
}) => {
  const socialItems = [
    {
      key: "github",
      icon: Github,
      label: "GitHub",
      href: socialLinks?.github,
      color: "#6e5494",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      href: socialLinks?.linkedin,
      color: "#0077b5",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter",
      href: socialLinks?.twitter,
      color: "#1da1f2",
    },
    {
      key: "website",
      icon: Globe,
      label: "Website",
      href: socialLinks?.website,
      color: "#14B8A6",
    },
  ];

  const activeSocialLinks = socialItems.filter((item) => item.href);

  if (activeSocialLinks.length === 0 && !showEditOptions) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Social Links</h2>
        {showEditOptions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 text-[#14B8A6] hover:text-[#0E9384] hover:bg-[#14B8A6]/10"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      {activeSocialLinks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {activeSocialLinks.map((social) => (
            <SocialLink
              key={social.key}
              href={social.href}
              icon={social.icon}
              label={social.label}
              color={social.color}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
              <Plus className="h-6 w-6 text-[#14B8A6]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Add your social links to connect with others
          </p>
          {showEditOptions && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="border-[#2A2A2A] text-gray-300 hover:bg-[#2A2A2A] hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Social Links
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSocialLinks;
