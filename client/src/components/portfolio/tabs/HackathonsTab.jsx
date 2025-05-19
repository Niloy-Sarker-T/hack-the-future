import { Calendar, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HackathonsTab = ({ hackathons, showEditOptions = true }) => {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Hackathons ({hackathons.length})
        </h2>
        {showEditOptions && (
          <Button
            variant="outline"
            className="border-[#2A2A2A] bg-[#2A2A2A] text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Find Hackathons
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {hackathons.map((hackathon) => (
          <div
            key={hackathon.id}
            className="flex gap-4 bg-[#121212] rounded-lg p-4"
          >
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={hackathon.image || "/placeholder.svg"}
                alt={hackathon.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-lg font-semibold">{hackathon.name}</h3>
                <Badge
                  className={`w-fit ${
                    hackathon.position === "Winner"
                      ? "bg-green-500/20 text-green-400"
                      : hackathon.position === "Runner-up"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {hackathon.position}
                </Badge>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-1 text-[#14B8A6]" />
                  <span>{hackathon.date}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Briefcase className="h-4 w-4 mr-1 text-[#14B8A6]" />
                  <span>Project: {hackathon.project}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HackathonsTab;
