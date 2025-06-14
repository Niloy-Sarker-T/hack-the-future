import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User,
  Folder,
  Settings,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ProjectsTab from "@/components/portfolio/ProjectsTab";
import ProjectForm from "@/components/projects/ProjectForm";

export default function PortfolioPage() {
  const user = userStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );
  const [showProjectForm, setShowProjectForm] = useState(false);
  const navigate = useNavigate();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Statistics from user data
  const statistics = user?.statistics || {
    hackathons: 5,
    projects: 10,
    achievements: 3,
  };

  const handleAddProjectClick = () => setShowProjectForm(true);
  const handleFormClose = () => setShowProjectForm(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            Portfolio not found
          </h1>
          <p className="text-lg text-gray-600">
            Please log in to view your portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback className="text-2xl">
                {user.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Trophy className="text-yellow-500 w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{statistics.hackathons}</p>
                  <p className="text-sm text-muted-foreground">Hackathons</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Code2 className="text-blue-500 w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">{statistics.projects}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Award className="text-green-500 w-8 h-8" />
                <div>
                  <p className="text-2xl font-bold">
                    {statistics.achievements}
                  </p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    <a
                      href={user.socialLinks?.github}
                      className={`${
                        user.socialLinks?.github
                          ? "text-gray-700 hover:text-gray-900"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                    <a
                      href={user.socialLinks?.linkedin}
                      className={`${
                        user.socialLinks?.linkedin
                          ? "text-blue-600 hover:text-blue-800"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href={user.socialLinks?.twitter}
                      className={`${
                        user.socialLinks?.twitter
                          ? "text-sky-500 hover:text-sky-700"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a
                      href={user.socialLinks?.website}
                      className={`${
                        user.socialLinks?.website
                          ? "text-indigo-600 hover:text-indigo-800"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-6 w-6" />
                    </a>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to="/edit-profile">
                      <Button variant="outline" className="w-full">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button className="w-full" onClick={handleAddProjectClick}>
                      <Folder className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skills and Interests */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      )) || (
                        <p className="text-muted-foreground">
                          No skills added yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.interests?.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      )) || (
                        <p className="text-muted-foreground">
                          No interests added yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <ProjectsTab userId={user.id} isOwner={true} />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      )) || (
                        <p className="text-muted-foreground">
                          No skills added yet
                        </p>
                      )}
                    </div>
                  </div>
                  <Link to="/edit-profile?tab=skills">
                    <Button variant="outline">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Skills
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/edit-profile">
                    <Button variant="outline" className="w-full">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile Information
                    </Button>
                  </Link>
                  <Link to="/edit-profile?tab=social-links">
                    <Button variant="outline" className="w-full">
                      <Globe className="w-4 h-4 mr-2" />
                      Manage Social Links
                    </Button>
                  </Link>
                  <Link to="/edit-profile?tab=skills">
                    <Button variant="outline" className="w-full">
                      <Code2 className="w-4 h-4 mr-2" />
                      Update Skills
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Form Dialog */}
        <ProjectForm open={showProjectForm} onClose={handleFormClose} />
      </div>
    </div>
  );
}
