import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Send,
  ArrowLeft,
  Github,
  Play,
  Film,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit,
} from "lucide-react";
import apiClient from "@/lib/axios-setup";
import useHackathonStore from "@/store/hackathon-store";

export default function ProjectManagementPage() {
  const { hackathonId, projectId } = useParams();
  const navigate = useNavigate();
  const { currentHackathon, getHackathonById } = useHackathonStore();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    demoUrl: "",
    videoUrl: "",
    repositoryUrl: "",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadProjectData();
    loadHackathonData();
  }, [projectId, hackathonId]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
  };

  const loadProjectData = async () => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      const projectData = response.data;
      setProject(projectData);
      setFormData({
        title: projectData.title || "",
        description: projectData.description || "",
        tags: projectData.tags || [],
        demoUrl: projectData.demoUrl || "",
        videoUrl: projectData.videoUrl || "",
        repositoryUrl: projectData.repositoryUrl || "",
      });
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Failed to load project");
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

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.put(
        `/projects/${projectId}/hackathon`,
        formData
      );
      setProject(response.data);
      setIsEditing(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error(
        "Please ensure title and description are filled before submitting"
      );
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/projects/${projectId}/submit`);
      await loadProjectData(); // Refresh project data
      toast.success("Project submitted successfully!");
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error(error.response?.data?.message || "Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw this submission?")) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/projects/${projectId}/withdraw`);
      await loadProjectData(); // Refresh project data
      toast.success("Submission withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing submission:", error);
      toast.error(
        error.response?.data?.message || "Failed to withdraw submission"
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmissionDeadlinePassed = () => {
    if (!currentHackathon?.submissionDeadline) return false;
    return new Date() > new Date(currentHackathon.submissionDeadline);
  };

  const canEdit = () => {
    return (
      !isSubmissionDeadlinePassed() && project?.submissionStatus !== "judged"
    );
  };

  const canSubmit = () => {
    return (
      !isSubmissionDeadlinePassed() &&
      project?.submissionStatus === "draft" &&
      formData.title.trim() &&
      formData.description.trim()
    );
  };

  const canWithdraw = () => {
    return (
      !isSubmissionDeadlinePassed() && project?.submissionStatus === "submitted"
    );
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/hackathons/${hackathonId}/projects`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">
            {currentHackathon?.title} Project
          </p>
        </div>

        <Badge
          variant={
            project.submissionStatus === "submitted" ? "default" : "secondary"
          }
          className="text-sm"
        >
          {project.submissionStatus === "submitted" && (
            <CheckCircle className="h-3 w-3 mr-1" />
          )}
          {project.submissionStatus === "draft" && (
            <Edit className="h-3 w-3 mr-1" />
          )}
          {project.submissionStatus}
        </Badge>
      </div>

      {/* Deadline Warning */}
      {currentHackathon?.submissionDeadline && (
        <Alert
          className={
            isSubmissionDeadlinePassed()
              ? "border-red-200 bg-red-50"
              : "border-orange-200 bg-orange-50"
          }
        >
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Submission Deadline: </span>
            {new Date(currentHackathon.submissionDeadline).toLocaleString()}
            {isSubmissionDeadlinePassed() && (
              <span className="text-red-600 font-medium"> (Passed)</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {project.submissionStatus === "draft" && (
          <>
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  disabled={!canEdit()}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="mr-2 h-4 w-4" />
                  Submit Project
                </Button>
              </>
            )}
          </>
        )}

        {project.submissionStatus === "submitted" && (
          <Button
            variant="destructive"
            onClick={handleWithdraw}
            disabled={!canWithdraw() || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <AlertTriangle className="mr-2 h-4 w-4" />
            Withdraw Submission
          </Button>
        )}
      </div>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
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
                  className="min-h-[150px]"
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
                      e.key === "Enter" && (e.preventDefault(), handleTagAdd())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleTagAdd}
                    variant="outline"
                    size="sm"
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
                        className="ml-2 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="md:col-span-2">
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
          ) : (
            // View Mode
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Title
                </Label>
                <p className="text-lg font-semibold">{project.title}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.repositoryUrl && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Repository
                    </Label>
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 mt-1"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </div>
                )}

                {project.demoUrl && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Demo
                    </Label>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 mt-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Try Demo
                    </a>
                  </div>
                )}

                {project.videoUrl && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Video
                    </Label>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-purple-600 hover:text-purple-800 mt-1"
                    >
                      <Film className="h-4 w-4 mr-2" />
                      Watch Video
                    </a>
                  </div>
                )}
              </div>

              {project.submittedAt && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Submitted
                  </Label>
                  <p className="text-sm">
                    {new Date(project.submittedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
