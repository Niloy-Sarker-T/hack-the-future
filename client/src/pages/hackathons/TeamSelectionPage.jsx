import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useHackathonStore from "@/store/hackathon-store";
import {
  Users,
  Plus,
  Search,
  UserPlus,
  ArrowLeft,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function TeamSelectionPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { currentHackathon, getHackathonById } = useHackathonStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHackathonData();
  }, [hackathonId]);

  const loadHackathonData = async () => {
    if (!currentHackathon || currentHackathon.id !== hackathonId) {
      await getHackathonById(hackathonId);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentHackathon) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600">
          Hackathon not found
        </h2>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            Go Home
          </Button>
        </Link>
      </div>
    );
  }

  // Check if registration is still open
  const isRegistrationOpen =
    new Date() <= new Date(currentHackathon.registrationDeadline);

  if (!isRegistrationOpen) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Registration Closed
            </h2>
            <p className="text-red-700">
              Registration for this hackathon has ended.
            </p>
            <Link
              to={`/hackathons/${hackathonId}`}
              className="mt-4 inline-block"
            >
              <Button variant="outline">Back to Hackathon Details</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Team Registration</h1>
        <p className="text-lg text-muted-foreground">
          Choose how you'd like to participate in{" "}
          <span className="font-semibold">{currentHackathon.title}</span>
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <Badge variant="outline">
            Team Size: {currentHackathon.minTeamSize}-
            {currentHackathon.maxTeamSize} members
          </Badge>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              Registration closes:{" "}
              {new Date(
                currentHackathon.registrationDeadline
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Team Formation Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Create New Team */}
        <Card className="border-2 hover:border-blue-300 transition-colors cursor-pointer">
          <CardHeader className="text-center pb-4">
            <Plus className="h-12 w-12 mx-auto text-blue-600 mb-2" />
            <CardTitle className="text-xl">Create New Team</CardTitle>
            <p className="text-sm text-muted-foreground">
              Start fresh and build your own team
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Be the team leader</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <UserPlus className="h-4 w-4 text-blue-600" />
                <span>Invite members you want</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Search className="h-4 w-4 text-blue-600" />
                <span>Set your team's vision</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                navigate(`/hackathons/${hackathonId}/teams/create`)
              }
            >
              Create Team
            </Button>
          </CardContent>
        </Card>

        {/* Browse Teams */}
        <Card className="border-2 hover:border-green-300 transition-colors cursor-pointer">
          <CardHeader className="text-center pb-4">
            <Search className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle className="text-xl">Browse Teams</CardTitle>
            <p className="text-sm text-muted-foreground">
              Join an existing team looking for members
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-green-600" />
                <span>See all available teams</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <UserPlus className="h-4 w-4 text-green-600" />
                <span>Request to join teams</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Search className="h-4 w-4 text-green-600" />
                <span>Filter by skills & interests</span>
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() =>
                navigate(`/hackathons/${hackathonId}/teams/browse`)
              }
            >
              Browse Teams
            </Button>
          </CardContent>
        </Card>

        {/* Find Teammates */}
        <Card className="border-2 hover:border-purple-300 transition-colors cursor-pointer">
          <CardHeader className="text-center pb-4">
            <UserPlus className="h-12 w-12 mx-auto text-purple-600 mb-2" />
            <CardTitle className="text-xl">Find Teammates</CardTitle>
            <p className="text-sm text-muted-foreground">
              Connect with individual participants
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Browse individual participants</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <UserPlus className="h-4 w-4 text-purple-600" />
                <span>Send collaboration invites</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Search className="h-4 w-4 text-purple-600" />
                <span>Match by skills & experience</span>
              </div>
            </div>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate(`/hackathons/${hackathonId}/teams/find`)}
            >
              Find Teammates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Formation Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-2 text-blue-800">
            💡 Team Formation Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-medium mb-1">Diverse Skills</p>
              <p>
                Look for teammates with complementary skills - frontend,
                backend, design, and domain expertise.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Communication</p>
              <p>
                Choose teammates who can communicate effectively and are
                committed to the timeline.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Time Zones</p>
              <p>
                Consider time zone differences if you're planning remote
                collaboration.
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Shared Vision</p>
              <p>
                Align on the type of project you want to build and the level of
                ambition.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solo Option */}
      {currentHackathon.allowSoloParticipation && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="text-center py-6">
            <h3 className="font-semibold mb-2 text-amber-800">
              Prefer to work alone?
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              Solo participation is allowed for this hackathon.
            </p>
            <Link to={`/hackathons/${hackathonId}/apply`}>
              <Button
                variant="outline"
                className="border-amber-600 text-amber-700"
              >
                Register as Solo Participant
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

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
}
