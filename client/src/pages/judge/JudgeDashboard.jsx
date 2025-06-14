import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  Trophy,
  Eye,
  Loader2,
  Star,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios-setup";

export default function JudgeDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await apiClient.get("/judges/my-assignments");
      setAssignments(response.data || []);
    } catch (error) {
      console.error("Error loading judge assignments:", error);
      toast.error("Failed to load your judge assignments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Judging Open";
      case "ended":
        return "Completed";
      default:
        return status;
    }
  };

  const handleStartJudging = (hackathonId) => {
    navigate(`/judge/hackathons/${hackathonId}/projects`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Judge Dashboard</h1>
        <p className="text-muted-foreground">
          Your hackathon judging assignments and evaluation tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{assignments.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Hackathons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {
                  assignments.filter((a) => a.hackathon.status === "ongoing")
                    .length
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {
                  assignments.filter((a) => a.hackathon.status === "ended")
                    .length
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Judge Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
              <p className="text-muted-foreground">
                You haven't been assigned to judge any hackathons yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">
                            {assignment.hackathon.title}
                          </h3>
                          <Badge
                            className={getStatusColor(
                              assignment.hackathon.status
                            )}
                          >
                            {getStatusText(assignment.hackathon.status)}
                          </Badge>
                          <Badge variant="outline">{assignment.role}</Badge>
                        </div>

                        <p className="text-muted-foreground line-clamp-2">
                          {assignment.hackathon.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Assigned:{" "}
                              {new Date(
                                assignment.assignedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {assignment.hackathon.submissionDeadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                Deadline:{" "}
                                {new Date(
                                  assignment.hackathon.submissionDeadline
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {assignment.hackathon.judgingCriteria && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Judging Criteria:
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.hackathon.judgingCriteria}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {assignment.hackathon.status === "ongoing" && (
                          <Button
                            onClick={() =>
                              handleStartJudging(assignment.hackathon.id)
                            }
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Start Judging
                          </Button>
                        )}
                        {assignment.hackathon.status === "ended" && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleStartJudging(assignment.hackathon.id)
                            }
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
