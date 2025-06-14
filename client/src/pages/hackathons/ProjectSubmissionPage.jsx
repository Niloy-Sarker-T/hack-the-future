import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, Github, Play, Film } from "lucide-react";
import apiClient from "@/lib/axios-setup";
import useHackathonStore from "@/store/hackathon-store";
import userStore from "@/store/user-store";

export default function ProjectSubmissionPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  const { currentHackathon, getHackathonById } = useHackathonStore();

  const [loading, setLoading] = useState(false);
  const [submissionMode, setSubmissionMode] = useState(null); // 'new' or 'existing'
  const [existingProjects, setExistingProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    demoUrl: "",
    videoUrl: "",
    repositoryUrl: "",
    teamId: null, // Will be set based on user's team in this hackathon
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadHackathonData();
    loadMyProjects();
  }, [hackathonId]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
  };

  const loadMyProjects = async () => {
    try {
      const response = await apiClient.get(
        `/projects/hackathon/${hackathonId}/my`
      );
      setExistingProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const handleTagAdd = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleCreateNewProject = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/projects/hackathon", {
        ...formData,
        hackathonId,
      });

      toast.success("Project created successfully!");
      navigate(`/hackathons/${hackathonId}/projects/${response.data.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExistingProject = async (project) => {
    setSelectedProject(project);
    // Navigate to project management page
    navigate(`/hackathons/${hackathonId}/projects/${project.id}`);
  };

  const handleSubmitProject = async (projectId) => {
    setLoading(true);
    try {
      await apiClient.put(`/projects/${projectId}/submit`);
      toast.success("Project submitted successfully!");
      loadMyProjects(); // Refresh the list
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(error.response?.data?.message || "Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  if (!currentHackathon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Submit Project</h1>
        <p className="text-muted-foreground">
          Submit your project for{" "}
          <span className="font-semibold">{currentHackathon.title}</span>
        </p>
      </div>

      {/* Mode Selection */}
      {!submissionMode && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Submission Option</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSubmissionMode("new")}
            >
              <Upload className="h-8 w-8" />
              <span>Create New Project</span>
              <span className="text-sm text-muted-foreground">
                Start fresh with a new project
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSubmissionMode("existing")}
              disabled={existingProjects.length === 0}
            >
              <Badge className="h-8 w-8 rounded-full" />
              <span>Use Existing Project</span>
              <span className="text-sm text-muted-foreground">
                {existingProjects.length > 0
                  ? `${existingProjects.length} project(s) available`
                  : "No existing projects"}
              </span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create New Project Form */}
      {submissionMode === "new" && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setSubmissionMode(null)}
              className="self-start"
            >
              ← Back to options
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="My Awesome Project"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your project..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleTagAdd())
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleTagAdd}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="repositoryUrl">Repository URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="repositoryUrl"
                      value={formData.repositoryUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          repositoryUrl: e.target.value,
                        }))
                      }
                      placeholder="https://github.com/username/project"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <div className="relative">
                    <Play className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          demoUrl: e.target.value,
                        }))
                      }
                      placeholder="https://yourproject.demo.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <div className="relative">
                    <Film className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          videoUrl: e.target.value,
                        }))
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSubmissionMode(null)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewProject} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Projects List */}
      {submissionMode === "existing" && (
        <Card>
          <CardHeader>
            <CardTitle>Your Existing Projects</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setSubmissionMode(null)}
              className="self-start"
            >
              ← Back to options
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingProjects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold truncate">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            project.submissionStatus === "submitted"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {project.submissionStatus}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleSelectExistingProject(project)}
                        >
                          {project.submissionStatus === "submitted"
                            ? "View"
                            : "Edit"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
