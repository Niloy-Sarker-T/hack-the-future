import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import userStore from "@/store/user-store";
import {
  Edit2,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Trophy,
  Code2,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import AlertDialog from "@/components/projects/AlertDialog"; // adjust path if needed
import ProjectForm from "@/components/projects/ProjectForm"; // adjust path if needed

export default function PortfolioPage() {
  const user = userStore((state) => state.user);
  const [showDialog, setShowDialog] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Dummy: statistics, replace with real data as needed
  const statistics = user.statistics || {
    hackathons: 5,
    projects: 10,
    achievements: 3,
  };

  const handleAddProjectClick = () => setShowDialog(true);

  const handleDialogSelect = (isHackathon) => {
    setShowDialog(false);
    if (isHackathon) {
      // You can navigate or handle hackathon logic here
      // Example: navigate("/hackathon/submit");
      // For now, just close dialog
    } else {
      setShowForm(true);
    }
  };

  const handleDialogClose = () => setShowDialog(false);
  const handleFormClose = () => setShowForm(false);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
      {/* Profile & Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile & Actions */}
        <aside className="md:col-span-1 flex flex-col items-center gap-6">
          <Card className="w-full flex flex-col items-center p-6">
            <Avatar className="w-24 h-24 mb-3">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.fullName}</CardTitle>
            <div className="flex gap-3 mt-2 w-full items-center justify-between">
              <div className="flex gap-2">
                <a
                  key={"github"}
                  href={user.socialLinks?.github}
                  className={`${
                    user.socialLinks?.github
                      ? "text-slate-700 hover:text-slate-600 text-lg"
                      : "disabled text-gray-400"
                  }`}
                  title={"github"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  key={"linkedin"}
                  href={user.socialLinks?.linkedin}
                  className={`${
                    user.socialLinks?.linkedin
                      ? "text-blue-500 hover:text-blue-600 text-lg"
                      : "disabled text-gray-400"
                  }`}
                  title={"linkedin"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  key={"twitter"}
                  href={user.socialLinks?.twitter}
                  className={`${
                    user.socialLinks?.twitter
                      ? "text-neutral-900 hover:text-neutral-700 text-lg"
                      : "disabled text-gray-400"
                  }`}
                  title={"twitter"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  key={"website"}
                  href={user.socialLinks?.website}
                  className={`${
                    user.socialLinks?.website
                      ? "text-indigo-400 hover:text-indigo-300 text-lg"
                      : "disabled text-gray-400"
                  }`}
                  title={"website"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-6 w-6" />
                </a>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/edit-profile?tab=social-links">
                    <button className="p-2 rounded hover:bg-muted transition-colors">
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-foreground text-background border border-muted shadow-md rounded-lg px-3 py-2"
                  side="top"
                  sideOffset={2}
                  align="center"
                >
                  <div className="absolute left-1/2 top-full -mt-1.5 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-foreground" />
                  <p>Edit links</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2 w-full mt-6">
              <Link to="/edit-profile">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
              <Button className="w-full" onClick={handleAddProjectClick}>
                Add a Project
              </Button>
            </div>
          </Card>
        </aside>

        {/* Right: Skills & Interests */}
        <main className="md:col-span-2 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* User Statistics - Full Width */}
      <section>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:gap-6 justify-between sm:items-center gap-10">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-500" />
                <span className="font-semibold">{statistics.hackathons}</span>
                <span className="text-muted-foreground">Hackathons</span>
              </div>
              <div className="flex items-center gap-3">
                <Code2 className="text-blue-500" />
                <span className="font-semibold">{statistics.projects}</span>
                <span className="text-muted-foreground">Projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-green-500" />
                <span className="font-semibold">{statistics.achievements}</span>
                <span className="text-muted-foreground">Achievements</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AlertDialog Modal */}
      {showDialog && (
        <AlertDialog
          onClose={handleDialogClose}
          onSelect={handleDialogSelect}
        />
      )}

      {/* ProjectForm Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              className="absolute top-2 right-4 text-gray-500 text-2xl"
              onClick={handleFormClose}
              aria-label="Close"
            >
              &times;
            </button>
            <ProjectForm />
          </div>
        </div>
      )}
    </div>
  );
}
