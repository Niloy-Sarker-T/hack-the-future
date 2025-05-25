import { useState, useEffect } from "react";
import { Code, Calendar, Award, Heart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const StatCard = ({ icon: Icon, value, label, color = "#14B8A6", onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex flex-col items-center p-4 bg-[#121212] rounded-lg transition-all duration-300 cursor-pointer ${
        isHovered ? "transform scale-105 bg-[#1A1A1A]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300"
        style={{
          backgroundColor: isHovered ? `${color}40` : `${color}20`,
          transform: isHovered ? "rotate(10deg)" : "rotate(0deg)",
        }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-1">
          <AnimatedNumber value={value} />
        </div>
        <div className="text-xs text-gray-400 mb-2">{label}</div>
      </div>
    </div>
  );
};

const ProfileStats = ({ stats, showEditOptions = true, onStatClick }) => {
  const [selectedStat, setSelectedStat] = useState(null);

  const statItems = [
    {
      key: "projects",
      icon: Code,
      value: stats.projects,
      label: "Projects",
      color: "#14B8A6",
      trend: 12,
    },
    {
      key: "hackathons",
      icon: Calendar,
      value: stats.hackathons,
      label: "Hackathons",
      color: "#3B82F6",
      trend: 8,
    },
    {
      key: "achievements",
      icon: Award,
      value: stats.achievements,
      label: "Achievements",
      color: "#F59E0B",
      trend: 25,
    },
    {
      key: "likes",
      icon: Heart,
      value: stats.likes,
      label: "Likes",
      color: "#EF4444",
      trend: 15,
    },
    {
      key: "followers",
      icon: Users,
      value: stats.followers,
      label: "Followers",
      color: "#8B5CF6",
      trend: 18,
    },
    {
      key: "following",
      icon: Users,
      value: stats.following,
      label: "Following",
      color: "#06B6D4",
      trend: 5,
    },
  ];

  const handleStatClick = (statKey) => {
    setSelectedStat(statKey);
    if (onStatClick) {
      onStatClick(statKey);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Stats</h2>
        {/* {showEditOptions && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[#14B8A6] hover:text-[#0E9384] hover:bg-[#14B8A6]/10"
          >
            View Analytics
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            trend={stat.trend}
            onClick={() => handleStatClick(stat.key)}
          />
        ))}
      </div>

      {/* Summary Section */}
      {/* <div className="mt-6 p-4 bg-[#121212] rounded-lg border border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Engagement</p>
            <p className="text-xl font-semibold text-white">
              <AnimatedNumber value={stats.likes + stats.followers} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Activity Score</p>
            <p className="text-xl font-semibold text-[#14B8A6]">
              <AnimatedNumber
                value={Math.floor(
                  (stats.projects + stats.hackathons + stats.achievements) * 8.5
                )}
              />
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileStats;
