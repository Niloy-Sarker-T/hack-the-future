import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  Plus,
  Loader2,
  Github,
  Globe,
  Video,
  Trophy,
  Info,
} from "lucide-react";
import useProjectsStore from "@/store/projects-store";
import useHackathonStore from "@/store/hackathon-store";
import userStore from "@/store/user-store";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

const HackathonProjectForm = ({ hackathon, registrationStatus, onClose }) => {
  const { createHackathonProject, updateHackathonProject, loading } =
    useProjectsStore();
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const { hackathonId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repositoryUrl: "",
    demoUrl: "",
    videoUrl: "",
    tags: [],
    hackathonId: hackathonId,
    teamId: registrationStatus?.teamId || null,
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (formData.repositoryUrl && !isValidUrl(formData.repositoryUrl)) {
      newErrors.repositoryUrl = "Please enter a valid repository URL";
    }

    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = "Please enter a valid demo URL";
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid video URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createHackathonProject(formData);

      if (result.success) {
        toast.success("Hackathon project created successfully!");
        navigate(`/hackathons/${hackathonId}`);
        onClose?.();
      } else {
        toast.error(result.error || "Failed to create project");
      }
    } catch (error) {
      toast.error("Failed to create hackathon project");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "newTag") {
      e.preventDefault();
      addTag();
    }
  };

  const isTeamProject = registrationStatus?.participationType === "team";
  const hasTeam = registrationStatus?.teamId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/hackathons/${hackathonId}`)}
            className="mb-4"
          >
            ← Back to Hackathon
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Submit Project</h1>
              <p className="text-muted-foreground">{hackathon?.title}</p>
            </div>
          </div>

          {/* Registration Info Alert */}
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You're submitting as a{" "}
              <strong>{registrationStatus?.participationType}</strong>{" "}
              participant
              {isTeamProject && hasTeam && (
                <span>
                  {" "}
                  for team ID: <strong>{registrationStatus.teamId}</strong>
                </span>
              )}
              {isTeamProject && !hasTeam && (
                <span className="text-amber-600">
                  . Note: You need to join a team first.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="My Amazing Hackathon Project"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, what it does, how it solves the problem, and what technologies you used..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`min-h-[120px] ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repositoryUrl">
                    <Github className="w-4 h-4 inline mr-1" />
                    Repository URL *
                  </Label>
                  <Input
                    id="repositoryUrl"
                    placeholder="https://github.com/username/project"
                    value={formData.repositoryUrl}
                    onChange={(e) =>
                      handleInputChange("repositoryUrl", e.target.value)
                    }
                    className={errors.repositoryUrl ? "border-red-500" : ""}
                  />
                  {errors.repositoryUrl && (
                    <p className="text-sm text-red-500">
                      {errors.repositoryUrl}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Link to your project's source code
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demoUrl">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Live Demo URL
                  </Label>
                  <Input
                    id="demoUrl"
                    placeholder="https://myproject.vercel.app"
                    value={formData.demoUrl}
                    onChange={(e) =>
                      handleInputChange("demoUrl", e.target.value)
                    }
                    className={errors.demoUrl ? "border-red-500" : ""}
                  />
                  {errors.demoUrl && (
                    <p className="text-sm text-red-500">{errors.demoUrl}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Link to your live project (optional)
                  </p>
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">
                  <Video className="w-4 h-4 inline mr-1" />
                  Demo Video URL (Optional)
                </Label>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) =>
                    handleInputChange("videoUrl", e.target.value)
                  }
                  className={errors.videoUrl ? "border-red-500" : ""}
                />
                {errors.videoUrl && (
                  <p className="text-sm text-red-500">{errors.videoUrl}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Link to a demo video of your project (YouTube, Vimeo, etc.)
                </p>
              </div>

              {/* Technologies/Tags */}
              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    name="newTag"
                    placeholder="Add a technology (e.g., React, Python, PostgreSQL)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add technologies, frameworks, and tools you used in this
                  project
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/hackathons/${hackathonId}`)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HackathonProjectForm;
