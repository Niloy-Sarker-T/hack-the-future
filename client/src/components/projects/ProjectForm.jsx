import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Plus, Loader2, Github, Globe, Video } from "lucide-react";
import useProjectsStore from "@/store/projects-store";
import { toast } from "sonner";

const ProjectForm = ({ open, onClose, projectToEdit = null }) => {
  const { createProject, updateProject, loading } = useProjectsStore();

  const [formData, setFormData] = useState({
    title: projectToEdit?.title || "",
    description: projectToEdit?.description || "",
    demoUrl: projectToEdit?.demoUrl || "",
    videoUrl: projectToEdit?.videoUrl || "",
    repositoryUrl: projectToEdit?.repositoryUrl || "",
    isPublic: projectToEdit?.isPublic ?? true,
    tags: projectToEdit?.tags || [],
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
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      newErrors.demoUrl = "Please enter a valid URL";
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid URL";
    }

    if (formData.repositoryUrl && !isValidUrl(formData.repositoryUrl)) {
      newErrors.repositoryUrl = "Please enter a valid URL";
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
      let result;
      if (projectToEdit) {
        result = await updateProject(projectToEdit.id, formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        toast.success(
          projectToEdit
            ? "Project updated successfully!"
            : "Project created successfully!"
        );
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          demoUrl: "",
          videoUrl: "",
          repositoryUrl: "",
          isPublic: true,
          tags: [],
        });
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "newTag") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {projectToEdit ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            {projectToEdit
              ? "Update your project details below."
              : "Share your project with the community. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="My Awesome Project"
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
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your project, its features, and what makes it special..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${
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
                Repository URL
              </Label>
              <Input
                id="repositoryUrl"
                placeholder="https://github.com/username/repo"
                value={formData.repositoryUrl}
                onChange={(e) =>
                  handleInputChange("repositoryUrl", e.target.value)
                }
                className={errors.repositoryUrl ? "border-red-500" : ""}
              />
              {errors.repositoryUrl && (
                <p className="text-sm text-red-500">{errors.repositoryUrl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoUrl">
                <Globe className="w-4 h-4 inline mr-1" />
                Live Demo URL
              </Label>
              <Input
                id="demoUrl"
                placeholder="https://myproject.com"
                value={formData.demoUrl}
                onChange={(e) => handleInputChange("demoUrl", e.target.value)}
                className={errors.demoUrl ? "border-red-500" : ""}
              />
              {errors.demoUrl && (
                <p className="text-sm text-red-500">{errors.demoUrl}</p>
              )}
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
              onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              className={errors.videoUrl ? "border-red-500" : ""}
            />
            {errors.videoUrl && (
              <p className="text-sm text-red-500">{errors.videoUrl}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Technologies & Tags</Label>
            <div className="flex gap-2">
              <Input
                name="newTag"
                placeholder="Add a tag (e.g., React, Node.js)"
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
          </div>

          {/* Public/Private */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                handleInputChange("isPublic", checked)
              }
            />
            <Label htmlFor="isPublic" className="text-sm font-medium">
              Make this project public in my portfolio
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {projectToEdit ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
