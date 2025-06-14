import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Search,
  Github,
  Play,
  Film,
  Users,
  User,
  Calendar,
  Trophy,
} from "lucide-react";
import apiClient from "@/lib/axios-setup";
import useHackathonStore from "@/store/hackathon-store";

export default function HackathonProjectsPage() {
  const { hackathonId } = useParams();
  const { currentHackathon, getHackathonById } = useHackathonStore();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadHackathonData();
    loadAllProjects();
    loadMyProjects();
  }, [hackathonId, statusFilter, currentPage]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
  };

  const loadAllProjects = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/projects/hackathon/${hackathonId}/all`,
        {
          params: {
            status: statusFilter,
            page: currentPage,
            limit: 12,
          },
        }
      );
      setProjects(response.data.projects || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyProjects = async () => {
    try {
      const response = await apiClient.get(
        `/projects/hackathon/${hackathonId}/my`
      );
      setMyProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error loading my projects:", error);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "judged":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isSubmissionOpen = () => {
    if (!currentHackathon?.submissionDeadline) return true;
    return new Date() <= new Date(currentHackathon.submissionDeadline);
  };

  if (!currentHackathon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Submissions for{" "}
          <span className="font-semibold">{currentHackathon.title}</span>
        </p>
        {currentHackathon.submissionDeadline && (
          <p className="text-sm text-muted-foreground">
            Submission deadline:{" "}
            {new Date(currentHackathon.submissionDeadline).toLocaleString()}
          </p>
        )}
      </div>

      {/* Submit Project Button */}
      {isSubmissionOpen() && (
        <div className="text-center">
          <Link to={`/hackathons/${hackathonId}/submit`}>
            <Button size="lg" className="px-8">
              <Trophy className="mr-2 h-4 w-4" />
              Submit Your Project
            </Button>
          </Link>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Submissions ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="my">
            My Projects ({myProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="judged">Judged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <Badge
                        className={getStatusColor(project.submissionStatus)}
                      >
                        {project.submissionStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Creator/Team Info */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {project.team ? (
                        <>
                          <Users className="h-4 w-4" />
                          <span>{project.team.name}</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          <span>{project.creator?.name || "Solo Project"}</span>
                        </>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex space-x-2">
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title="View Repository"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded"
                          title="View Demo"
                        >
                          <Play className="h-4 w-4" />
                        </a>
                      )}
                      {project.videoUrl && (
                        <a
                          href={project.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded"
                          title="Watch Video"
                        >
                          <Film className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Submission Date */}
                    {project.submittedAt && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Submitted{" "}
                          {new Date(project.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pagination.totalPages, prev + 1)
                  )
                }
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          {myProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any projects yet
                </p>
                {isSubmissionOpen() && (
                  <Link to={`/hackathons/${hackathonId}/submit`}>
                    <Button>Create Your First Project</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <Badge
                        className={getStatusColor(project.submissionStatus)}
                      >
                        {project.submissionStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    {/* Team Info */}
                    {project.team && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{project.team.name}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/hackathons/${hackathonId}/projects/${project.id}`}
                      >
                        <Button size="sm" variant="outline" className="flex-1">
                          {project.submissionStatus === "submitted"
                            ? "View"
                            : "Edit"}
                        </Button>
                      </Link>

                      {/* Links */}
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded"
                        >
                          <Play className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Submission Date */}
                    {project.submittedAt && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Submitted{" "}
                          {new Date(project.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
