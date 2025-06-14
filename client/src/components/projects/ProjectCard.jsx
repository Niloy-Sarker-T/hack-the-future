import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Github,
  Globe,
  Video,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Trophy,
  ExternalLink,
} from "lucide-react";
import useProjectsStore from "@/store/projects-store";
import { toast } from "sonner";

const ProjectCard = ({
  project,
  isOwner = false,
  onEdit,
  showHackathonInfo = false,
  compact = false,
}) => {
  const { deleteProject, loading } = useProjectsStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await deleteProject(project.id);
      if (result.success) {
        toast.success("Project deleted successfully");
        setShowDeleteDialog(false);
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Draft", variant: "secondary" },
      submitted: { label: "Submitted", variant: "default" },
      judged: { label: "Judged", variant: "success" },
      in_progress: { label: "In Progress", variant: "outline" },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: "outline",
    };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              {/* Project metadata */}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                {showHackathonInfo && project.hackathonId && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>Hackathon Project</span>
                  </div>
                )}

                {project.submissionStatus &&
                  getStatusBadge(project.submissionStatus)}

                {project.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Team info for hackathon projects */}
              {project.team && (
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>Team: {project.team.name}</span>
                </div>
              )}
            </div>

            {/* Actions dropdown */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(project)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.slice(0, compact ? 3 : 6).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > (compact ? 3 : 6) && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - (compact ? 3 : 6)} more
                </Badge>
              )}
            </div>
          )}

          {/* Creator info for non-owner view */}
          {!isOwner && project.creator && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
              <Avatar className="w-6 h-6">
                <AvatarImage src={project.creator.avatar} />
                <AvatarFallback className="text-xs">
                  {project.creator.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                by {project.creator.name}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          {/* Project links */}
          <div className="flex items-center gap-2">
            {project.repositoryUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}

            {project.demoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </Button>
            )}

            {project.videoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          {/* Likes and interaction */}
          <div className="flex items-center gap-2">
            {project.likes !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>{project.likes}</span>
              </div>
            )}

            {!compact && (
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
