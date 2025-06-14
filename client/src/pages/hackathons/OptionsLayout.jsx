import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  User,
  ArrowLeft,
  Trophy,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios-setup";
import useHackathonStore from "@/store/hackathon-store";

const OptionsLayout = () => {
  const navigate = useNavigate();
  const { hackathonId } = useParams();
  const { currentHackathon, getHackathonById } = useHackathonStore();

  const [loading, setLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    loadHackathonData();
    checkRegistrationStatus();
  }, [hackathonId]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await apiClient.get(
        `/hackathons/${hackathonId}/participants/me`
      );
      setRegistrationStatus(response.data);
    } catch (error) {
      console.log("Error checking registration status:", error);

      setRegistrationStatus(null);
    }
  };

  const handleRegistration = async (participationType) => {
    setLoading(true);
    try {
      // Validation checks
      if (
        participationType === "solo" &&
        !currentHackathon.allowSoloParticipation
      ) {
        toast.error("Solo participation is not allowed for this hackathon");
        return;
      }

      if (new Date() > new Date(currentHackathon.registrationDeadline)) {
        toast.error("Registration deadline has passed");
        return;
      }

      // Register
      await apiClient.post(`/hackathon-registration/${hackathonId}/register`, {
        participationType,
      });

      toast.success(
        `🎉 Successfully registered as ${participationType} participant!`,
        {
          description: "You can now start working on your project",
          duration: 5000,
        }
      );

      // Update local state and navigate
      setRegistrationStatus({ participationType });
      navigate(`/hackathons/${hackathonId}/projects`);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to register";
      toast.error(errorMessage);
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

  if (registrationStatus) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <h1 className="text-3xl font-bold text-green-600">
            Registration Successful! 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            You're registered for{" "}
            <span className="font-semibold">{currentHackathon.title}</span> as a{" "}
            <Badge variant="secondary" className="mx-1">
              {registrationStatus.participationType} participant
            </Badge>
          </p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              What's Next?
            </h2>
            <div className="space-y-4">
              <p className="text-green-700">
                Ready to start building? Submit your project when you're ready!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to={`/hackathons/${hackathonId}/submit`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Submit Your Project
                  </Button>
                </Link>
                <Link to={`/hackathons/${hackathonId}/projects`}>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600"
                  >
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to={`/hackathons/${hackathonId}`}>
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hackathon Details
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Register for {currentHackathon.title}
        </h1>
        <p className="text-muted-foreground">
          Choose how you'd like to participate in this hackathon
        </p>
      </div>

      {/* Registration deadline warning */}
      {currentHackathon.registrationDeadline && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Registration closes:{" "}
                {new Date(
                  currentHackathon.registrationDeadline
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Options */}
      <div
        className={`grid gap-6 ${
          currentHackathon.allowSoloParticipation
            ? "md:grid-cols-2"
            : "max-w-md mx-auto"
        }`}
      >
        {/* Solo Registration */}
        {currentHackathon.allowSoloParticipation && (
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-4">
              <User className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-xl">Solo Participant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Work independently on your project
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Full creative control</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Perfect for showcasing individual skills</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Compete in solo category</span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleRegistration("solo")}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register as Solo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Team Registration */}
        <Card className="border-2 hover:border-green-300 transition-colors">
          <CardHeader className="text-center pb-4">
            <Users className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle className="text-xl">Team Participant</CardTitle>
            <p className="text-sm text-muted-foreground">
              Collaborate with {currentHackathon.minTeamSize}-
              {currentHackathon.maxTeamSize} members
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Combine diverse skills and perspectives</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Learn from team collaboration</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Compete in team category</span>
              </div>
            </div>
            <Link to={`/hackathons/${hackathonId}/teams/select`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Team Registration
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Solo not allowed message */}
      {!currentHackathon.allowSoloParticipation && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                <strong>Note:</strong> Solo participation is not allowed for
                this hackathon. You must form or join a team to participate.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team formation info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-2 text-blue-800">
            💡 About Team Formation
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Ready to collaborate? Choose from multiple ways to form your team:
          </p>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-blue-700">
            <div>
              <p className="font-medium">🚀 Create Team</p>
              <p>Start your own team and invite members</p>
            </div>
            <div>
              <p className="font-medium">🔍 Browse Teams</p>
              <p>Join existing teams looking for members</p>
            </div>
            <div>
              <p className="font-medium">🤝 Find Teammates</p>
              <p>Connect with individual participants</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back button */}
      <div className="text-center">
        <Link to={`/hackathons/${hackathonId}`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hackathon Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OptionsLayout;
