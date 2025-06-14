import { useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Trophy,
  Users,
  ArrowRight,
  Calendar,
  Target,
} from "lucide-react";

export default function TeamSuccessPage() {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get team data from navigation state
  const { teamName, isLeader, memberCount, maxMembers } = location.state || {};

  useEffect(() => {
    // If no team data in state, redirect to team dashboard
    if (!teamName) {
      navigate(`/hackathons/${hackathonId}/teams/${teamId}`, { replace: true });
    }
  }, [teamName, hackathonId, teamId, navigate]);

  if (!teamName) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Team Registration Complete!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your team <span className="font-semibold">"{teamName}"</span> is ready
          for the hackathon
        </p>
      </div>

      {/* Team Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Users className="h-8 w-8 mx-auto text-green-600" />
              <h3 className="font-semibold text-green-800">Team Size</h3>
              <p className="text-green-700">
                {memberCount || 1}/{maxMembers || 4} members
              </p>
            </div>

            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-600" />
              <h3 className="font-semibold text-green-800">Your Role</h3>
              <Badge variant={isLeader ? "default" : "secondary"}>
                {isLeader ? "Team Leader" : "Team Member"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Calendar className="h-8 w-8 mx-auto text-green-600" />
              <h3 className="font-semibold text-green-800">Status</h3>
              <Badge
                variant="outline"
                className="border-green-600 text-green-700"
              >
                Ready to Build
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent className="py-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            What's Next?
          </h2>

          <div className="space-y-4">
            {isLeader ? (
              <>
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Build Your Team
                    </h4>
                    <p className="text-sm text-blue-600 mt-1">
                      Invite more members to join your team if you need
                      additional skills or want to expand your capabilities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-purple-800">
                      Plan Your Project
                    </h4>
                    <p className="text-sm text-purple-600 mt-1">
                      Start brainstorming ideas, assign roles, and create a
                      project timeline with your team.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Connect with Your Team
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    Reach out to your team leader and other members to start
                    planning your hackathon project.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Submit Your Project
                </h4>
                <p className="text-sm text-yellow-600 mt-1">
                  When your project is ready, submit it through the hackathon
                  platform before the deadline.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={`/hackathons/${hackathonId}/teams/${teamId}`}>
          <Button size="lg" className="w-full sm:w-auto">
            <Users className="h-4 w-4 mr-2" />
            Go to Team Dashboard
          </Button>
        </Link>

        <Link to={`/hackathons/${hackathonId}`}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <ArrowRight className="h-4 w-4 mr-2" />
            Back to Hackathon
          </Button>
        </Link>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-3 text-blue-800">
            💡 Pro Tips for Team Success:
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div>
              <p className="font-medium">• Set Up Communication</p>
              <p>
                Create a Discord/Slack channel or group chat for easy
                coordination
              </p>
            </div>
            <div>
              <p className="font-medium">• Define Roles Early</p>
              <p>
                Assign frontend, backend, design, and project management roles
              </p>
            </div>
            <div>
              <p className="font-medium">• Plan Your Tech Stack</p>
              <p>
                Agree on programming languages, frameworks, and tools to use
              </p>
            </div>
            <div>
              <p className="font-medium">• Set Milestones</p>
              <p>Break down your project into daily goals and checkpoints</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
