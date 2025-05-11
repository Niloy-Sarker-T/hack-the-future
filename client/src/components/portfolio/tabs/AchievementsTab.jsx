import { Award, Users } from "lucide-react";

const AchievementsTab = ({ achievements }) => {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">
        Achievements ({achievements.length})
      </h2>

      <div className="space-y-6">
        {achievements.map((achievement, index) => (
          <div key={achievement.id} className="relative">
            {index < achievements.length - 1 && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-[#2A2A2A]"></div>
            )}
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center flex-shrink-0">
                {achievement.icon === "trophy" ? (
                  <Award className="h-6 w-6 text-[#14B8A6]" />
                ) : achievement.icon === "innovation" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-[#14B8A6]"
                  >
                    <path d="M2 12h5" />
                    <path d="M17 12h5" />
                    <path d="M12 2v5" />
                    <path d="M12 17v5" />
                    <path d="M4.93 4.93l3.54 3.54" />
                    <path d="M15.54 15.54l3.54 3.54" />
                    <path d="M4.93 19.07l3.54-3.54" />
                    <path d="M15.54 8.46l3.54-3.54" />
                  </svg>
                ) : (
                  <Users className="h-6 w-6 text-[#14B8A6]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <span className="text-sm text-gray-400">
                    {achievement.date}
                  </span>
                </div>
                <p className="text-gray-300 mt-1">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsTab;
