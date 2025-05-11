import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProjectsTab from "./tabs/ProjectsTab";
import HackathonsTab from "./tabs/HackathonsTab";
import AchievementsTab from "./tabs/AchievementsTab";

const ProfileContent = ({ projectsData, hackathonsData, achievementsData }) => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="md:col-span-2">
      <Tabs
        defaultValue="projects"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-6 bg-[#1A1A1A] border border-[#2A2A2A]">
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="hackathons"
            className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white"
          >
            Hackathons
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white"
          >
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-0">
          <ProjectsTab projects={projectsData} />
        </TabsContent>

        <TabsContent value="hackathons" className="mt-0">
          <HackathonsTab hackathons={hackathonsData} />
        </TabsContent>

        <TabsContent value="achievements" className="mt-0">
          <AchievementsTab achievements={achievementsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
