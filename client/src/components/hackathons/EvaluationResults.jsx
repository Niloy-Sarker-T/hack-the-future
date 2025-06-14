import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Trophy,
  Star,
  Users,
  Eye,
  Download,
  Loader2,
  Medal,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios-setup";

export default function EvaluationResults({
  hackathonId,
  isOrganizer = false,
}) {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (hackathonId && isOrganizer) {
      loadEvaluations();
    }
  }, [hackathonId, isOrganizer]);

  const loadEvaluations = async () => {
    try {
      const response = await apiClient.get(
        `/judges/hackathons/${hackathonId}/evaluations`
      );
      setEvaluations(response.data || []);
    } catch (error) {
      console.error("Error loading evaluations:", error);
      toast.error("Failed to load evaluation results");
    } finally {
      setLoading(false);
    }
  };

  // Process data for display
  const processedData = () => {
    const projectMap = new Map();

    evaluations.forEach((evaluation) => {
      const projectId = evaluation.projectId;
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          projectId,
          projectTitle: evaluation.projectTitle,
          evaluations: [],
          totalScore: 0,
          averageScore: 0,
          judgeCount: 0,
        });
      }

      const project = projectMap.get(projectId);
      project.evaluations.push(evaluation);
      project.totalScore += evaluation.overallScore;
      project.judgeCount++;
      project.averageScore = project.totalScore / project.judgeCount;
    });

    return Array.from(projectMap.values()).sort(
      (a, b) => b.averageScore - a.averageScore
    );
  };

  const getProjectDetailData = (projectData) => {
    const criteriaScores = {};

    projectData.evaluations.forEach((evaluation) => {
      if (evaluation.scores) {
        Object.entries(evaluation.scores).forEach(([criteria, score]) => {
          if (!criteriaScores[criteria]) {
            criteriaScores[criteria] = [];
          }
          criteriaScores[criteria].push(score);
        });
      }
    });

    const chartData = Object.entries(criteriaScores).map(
      ([criteria, scores]) => ({
        criteria: criteria.charAt(0).toUpperCase() + criteria.slice(1),
        average: (
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        ).toFixed(1),
        scores: scores,
      })
    );

    return chartData;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4" />;
      case 2:
        return <Medal className="h-4 w-4" />;
      case 3:
        return <Medal className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  if (!isOrganizer) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Only hackathon organizers can view evaluation results.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const projectResults = processedData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Evaluation Results
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Project rankings and detailed evaluation scores
          </p>
        </div>

        {projectResults.length > 0 && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {projectResults.length === 0 ? (
          <div className="text-center py-8">
            <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No evaluations yet</h3>
            <p className="text-muted-foreground">
              Judges haven't submitted any evaluations for this hackathon yet.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Projects Evaluated
                      </p>
                      <p className="text-2xl font-bold">
                        {projectResults.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Evaluations
                      </p>
                      <p className="text-2xl font-bold">{evaluations.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                      <p className="text-2xl font-bold">
                        {projectResults.length > 0
                          ? (
                              projectResults.reduce(
                                (sum, p) => sum + p.averageScore,
                                0
                              ) / projectResults.length
                            ).toFixed(1)
                          : "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-center">Judges</TableHead>
                  <TableHead className="text-center">Avg Score</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectResults.map((project, index) => (
                  <TableRow key={project.projectId}>
                    <TableCell>
                      <Badge className={getRankColor(index + 1)}>
                        {getRankIcon(index + 1)}#{index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {project.projectTitle}
                    </TableCell>
                    <TableCell className="text-center">
                      {project.judgeCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {project.averageScore.toFixed(1)} / 100
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {project.projectTitle} - Detailed Evaluation
                            </DialogTitle>
                          </DialogHeader>

                          {selectedProject && (
                            <div className="space-y-6">
                              {/* Criteria Breakdown Chart */}
                              <div>
                                <h4 className="font-medium mb-4">
                                  Criteria Breakdown
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                  <BarChart
                                    data={getProjectDetailData(selectedProject)}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="criteria" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Bar dataKey="average" fill="#3b82f6" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>

                              <Separator />

                              {/* Individual Judge Evaluations */}
                              <div>
                                <h4 className="font-medium mb-4">
                                  Individual Judge Evaluations
                                </h4>
                                <div className="space-y-4">
                                  {selectedProject.evaluations.map(
                                    (evaluation, idx) => (
                                      <Card key={idx}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <h5 className="font-medium">
                                                {evaluation.judgeName}
                                              </h5>
                                              <Badge variant="outline">
                                                {evaluation.overallScore} / 100
                                              </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {new Date(
                                                evaluation.evaluatedAt
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>

                                          {evaluation.scores && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                              {Object.entries(
                                                evaluation.scores
                                              ).map(([criteria, score]) => (
                                                <div
                                                  key={criteria}
                                                  className="text-sm"
                                                >
                                                  <span className="text-muted-foreground">
                                                    {criteria
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                      criteria.slice(1)}
                                                    :
                                                  </span>
                                                  <span className="ml-1 font-medium">
                                                    {score}/10
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {evaluation.feedback && (
                                            <div className="pt-2 border-t">
                                              <p className="text-sm text-muted-foreground mb-1">
                                                Feedback:
                                              </p>
                                              <p className="text-sm">
                                                {evaluation.feedback}
                                              </p>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
