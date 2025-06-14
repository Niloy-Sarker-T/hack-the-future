import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Loader2, FolderOpen } from "lucide-react";
import useProjectsStore from "@/store/projects-store";
import userStore from "@/store/user-store";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";
import { toast } from "sonner";

const ProjectsTab = ({ userId, isOwner = false }) => {
  const user = userStore((state) => state.user);
  const { projects = [], loading, getUserProjects } = useProjectsStore();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterType, setFilterType] = useState("all"); // all, portfolio, hackathon

  useEffect(() => {
    if (userId) {
      loadProjects();
    }
  }, [userId]);

  const loadProjects = async () => {
    try {
      const result = await getUserProjects(userId);
      if (!result.success) {
        toast.error(result.error || "Failed to load projects");
      }
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleCloseForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  // Filter projects based on search and filters
  const filteredProjects = (projects || []).filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTag = filterTag === "all" || project.tags?.includes(filterTag);

    const matchesType =
      filterType === "all" ||
      (filterType === "hackathon" && project.hackathonId) ||
      (filterType === "portfolio" && !project.hackathonId);

    return matchesSearch && matchesTag && matchesType;
  });

  // Get all unique tags for filter
  const allTags = [
    ...new Set((projects || []).flatMap((project) => project.tags || [])),
  ];

  // Separate projects by type
  const portfolioProjects = filteredProjects.filter((p) => !p.hackathonId);
  const hackathonProjects = filteredProjects.filter((p) => p.hackathonId);

  if (loading && (!projects || projects.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isOwner ? "My Projects" : `${user?.fullName || "User"}'s Projects`}
          </h2>
          <p className="text-muted-foreground">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {isOwner && (
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="portfolio">Portfolio Only</SelectItem>
              <SelectItem value="hackathon">Hackathon Only</SelectItem>
            </SelectContent>
          </Select>

          {allTags.length > 0 && (
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[120px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Projects Content */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || filterTag !== "all" || filterType !== "all"
                ? "No projects found"
                : "No projects yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || filterTag !== "all" || filterType !== "all"
                ? "Try adjusting your search or filters"
                : isOwner
                ? "Start by adding your first project to showcase your work"
                : "This user hasn't added any projects yet"}
            </p>
            {isOwner &&
              !searchQuery &&
              filterTag === "all" &&
              filterType === "all" && (
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Project
                </Button>
              )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({filteredProjects.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              Portfolio ({portfolioProjects.length})
            </TabsTrigger>
            <TabsTrigger value="hackathon">
              Hackathon ({hackathonProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isOwner={isOwner}
                  onEdit={handleEditProject}
                  showHackathonInfo={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isOwner={isOwner}
                  onEdit={handleEditProject}
                  showHackathonInfo={false}
                />
              ))}
            </div>
            {portfolioProjects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground text-center">
                    No portfolio projects found
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hackathon" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathonProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isOwner={isOwner}
                  onEdit={handleEditProject}
                  showHackathonInfo={true}
                />
              ))}
            </div>
            {hackathonProjects.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground text-center">
                    No hackathon projects found
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Project Form Dialog */}
      <ProjectForm
        open={showProjectForm}
        onClose={handleCloseForm}
        projectToEdit={editingProject}
      />
    </div>
  );
};

export default ProjectsTab;
