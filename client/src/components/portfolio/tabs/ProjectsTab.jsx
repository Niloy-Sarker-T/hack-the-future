import { Plus, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProjectsTab = ({ projects }) => {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
        <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col md:flex-row gap-4 bg-[#121212] rounded-lg p-4"
          >
            <div className="md:w-1/3">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-300 text-sm mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] border-[#14B8A6]/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-[#14B8A6]" />
                  <span>{project.hackathon}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Heart className="h-4 w-4 mr-1 text-[#14B8A6]" />
                  <span>{project.likes} likes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
