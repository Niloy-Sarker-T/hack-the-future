import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import useHackathonStore from "@/store/hackathon-store";
import useTeamStore from "@/store/team-store";
import userStore from "@/store/user-store";
import {
  ArrowLeft,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateTeamPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { currentHackathon, getHackathonById } = useHackathonStore();
  const { createTeam } = useTeamStore();
  const user = userStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadHackathonData();
  }, [hackathonId]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    } else if (formData.teamName.length < 3) {
      newErrors.teamName = "Team name must be at least 3 characters";
    } else if (formData.teamName.length > 50) {
      newErrors.teamName = "Team name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create team using team store
      const result = await createTeam({
        name: formData.teamName.trim(),
        description: formData.description.trim(),
        hackathonId,
      });

      if (result.success) {
        const teamId = result.data.id;

        toast.success("🎉 Team created successfully!", {
          description: "You're now the team leader. Start inviting members!",
          duration: 5000,
          richColors: true,
        });

        // Navigate to team dashboard
        navigate(`/hackathons/${hackathonId}/teams/${teamId}`, {
          state: { isNewTeam: true },
        });
      } else {
        toast.error(result.message || "Failed to create team");
      }
    } catch (error) {
      console.error("Team creation error:", error);
      toast.error("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Create Your Team</h1>
        <p className="text-lg text-muted-foreground">
          Set up your team for{" "}
          <span className="font-semibold">{currentHackathon.title}</span>
        </p>
        <Badge variant="outline">
          Team Size: {currentHackathon.minTeamSize}-
          {currentHackathon.maxTeamSize} members
        </Badge>
      </div>

      {/* Team Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">
                Team Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                value={formData.teamName}
                onChange={(e) => handleChange("teamName", e.target.value)}
                className={errors.teamName ? "border-red-500" : ""}
                maxLength={50}
              />
              {errors.teamName && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.teamName}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.teamName.length}/50 characters
              </p>
            </div>

            {/* Team Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Team Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your team's vision, goals, or what you're looking for in teammates..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                rows={4}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.description}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Team...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Team Leader Benefits */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-3 text-blue-800 flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>As Team Leader, You Can:</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Invite specific people to join</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Manage team member requests</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Update team description</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>Remove inactive members</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-3 text-green-800 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Pro Tips for Team Success:</span>
          </h3>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>
                <strong>Choose a memorable name:</strong> Make it related to
                your project idea or team personality
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>
                <strong>Write a clear description:</strong> Help potential
                teammates understand your vision and goals
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>
                <strong>Be specific about skills:</strong> Mention what
                technical skills or expertise you're looking for
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back button */}
      <div className="text-center">
        <Link to={`/hackathons/${hackathonId}/teams/select`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team Selection
          </Button>
        </Link>
      </div>
    </div>
  );
}
