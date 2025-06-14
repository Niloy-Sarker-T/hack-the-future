import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  ExternalLink,
  Github,
  Play,
  Film,
  Star,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios-setup";

export default function ProjectEvaluationPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [evaluation, setEvaluation] = useState({
    scores: {},
    feedback: "",
    overallScore: 50,
  });

  // Default judging criteria if none specified
  const defaultCriteria = [
    { name: "innovation", label: "Innovation & Creativity", max: 10 },
    { name: "technical", label: "Technical Execution", max: 10 },
    { name: "design", label: "User Experience & Design", max: 10 },
    { name: "impact", label: "Potential Impact", max: 10 },
    { name: "presentation", label: "Project Presentation", max: 10 },
  ];

  useEffect(() => {
    loadData();
  }, [hackathonId]);

  useEffect(() => {
    // Initialize scores when criteria changes
    const initialScores = {};
    defaultCriteria.forEach((criteria) => {
      initialScores[criteria.name] = evaluation.scores[criteria.name] || 5;
    });
    setEvaluation((prev) => ({ ...prev, scores: initialScores }));
  }, []);

  const loadData = async () => {
    try {
      const [projectsResponse, hackathonResponse] = await Promise.all([
        apiClient.get(`/judges/hackathons/${hackathonId}/projects`),
        apiClient.get(`/hackathons/${hackathonId}`),
      ]);

      setProjects(projectsResponse.data || []);
      setHackathon(hackathonResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load projects for evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (criteriaName, value) => {
    setEvaluation((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [criteriaName]: value[0], // Slider returns array
      },
    }));
  };

  const handleOverallScoreChange = (value) => {
    setEvaluation((prev) => ({
      ...prev,
      overallScore: value[0],
    }));
  };

  const handleSubmitEvaluation = async () => {
    const currentProject = projects[currentProjectIndex];
    if (!currentProject) return;

    // Validate that all criteria have scores
    const missingScores = defaultCriteria.filter(
      (criteria) => evaluation.scores[criteria.name] === undefined
    );

    if (missingScores.length > 0) {
      toast.error("Please provide scores for all criteria");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(
        `/judges/projects/${currentProject.id}/evaluate`,
        evaluation
      );
      toast.success("Evaluation submitted successfully!");

      // Move to next project or go back to dashboard
      if (currentProjectIndex < projects.length - 1) {
        setCurrentProjectIndex(currentProjectIndex + 1);
        // Reset evaluation for next project
        setEvaluation({
          scores: {},
          feedback: "",
          overallScore: 50,
        });
      } else {
        navigate("/judge/dashboard");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit evaluation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Projects to Evaluate</h2>
          <p className="text-muted-foreground mb-6">
            There are no submitted projects available for evaluation in this
            hackathon.
          </p>
          <Button onClick={() => navigate("/judge/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentProject = projects[currentProjectIndex];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/judge/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Project Evaluation</h1>
          <p className="text-muted-foreground">
            {hackathon?.title} • Project {currentProjectIndex + 1} of{" "}
            {projects.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {currentProjectIndex + 1} / {projects.length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {currentProject.title}
                <Badge variant="secondary">
                  Submitted{" "}
                  {new Date(currentProject.submittedAt).toLocaleDateString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {currentProject.description}
                </p>
              </div>

              {currentProject.tags && currentProject.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Team</h4>
                <div className="flex items-center gap-2">
                  {currentProject.creator && (
                    <div className="flex items-center gap-2">
                      {currentProject.creator.avatarUrl && (
                        <img
                          src={currentProject.creator.avatarUrl}
                          alt={currentProject.creator.fullName}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm">
                        {currentProject.creator.fullName}
                      </span>
                    </div>
                  )}
                  {currentProject.team && (
                    <Badge variant="outline">
                      Team: {currentProject.team.name}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Project Links */}
              <div className="space-y-3">
                <h4 className="font-medium">Project Links</h4>
                <div className="space-y-2">
                  {currentProject.repositoryUrl && (
                    <a
                      href={currentProject.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      View Repository
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {currentProject.demoUrl && (
                    <a
                      href={currentProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Play className="h-4 w-4" />
                      View Live Demo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {currentProject.videoUrl && (
                    <a
                      href={currentProject.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Film className="h-4 w-4" />
                      Watch Demo Video
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {defaultCriteria.map((criteria) => (
                <div key={criteria.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {criteria.label}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {evaluation.scores[criteria.name] || 5} / {criteria.max}
                    </span>
                  </div>
                  <Slider
                    value={[evaluation.scores[criteria.name] || 5]}
                    onValueChange={(value) =>
                      handleScoreChange(criteria.name, value)
                    }
                    max={criteria.max}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Overall Score</Label>
                  <span className="text-sm text-muted-foreground">
                    {evaluation.overallScore} / 100
                  </span>
                </div>
                <Slider
                  value={[evaluation.overallScore]}
                  onValueChange={handleOverallScoreChange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide constructive feedback for the team..."
                  value={evaluation.feedback}
                  onChange={(e) =>
                    setEvaluation((prev) => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitEvaluation}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Send className="mr-2 h-4 w-4" />
                  Submit Evaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
