import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useHackathonStore from "@/store/hackathon-store";
import useTeamStore from "@/store/team-store";
import userStore from "@/store/user-store";
import apiClient from "@/lib/axios-setup";
import {
  ArrowLeft,
  Users,
  Crown,
  Settings,
  UserPlus,
  UserMinus,
  Mail,
  Trophy,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function TeamDashboard() {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHackathon, getHackathonById } = useHackathonStore();
  const { currentTeam, getTeam, updateTeam, leaveTeam, removeMember } =
    useTeamStore();
  const currentUser = userStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    teamName: "",
    description: "",
  });

  // Check if this is a new team from creation
  const isNewTeam = location.state?.isNewTeam;

  useEffect(() => {
    loadData();
  }, [hackathonId, teamId]);

  useEffect(() => {
    // Show welcome message for new teams
    if (isNewTeam && team) {
      toast.success("🎉 Welcome to your new team!", {
        description:
          "Start by inviting members or updating your team description",
        duration: 8000,
      });
    }
  }, [isNewTeam, team]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load hackathon data if needed
      if (!currentHackathon || currentHackathon.id !== hackathonId) {
        await getHackathonById(hackathonId);
      }

      // Load team data
      await loadTeam();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const loadTeam = async () => {
    try {
      const result = await getTeam(teamId);
      if (result.success) {
        const teamData = result.data;
        setTeam(teamData);
        setEditData({
          teamName: teamData.name,
          description: teamData.description || "",
        });

        // Check if current user is team leader
        setIsLeader(teamData.leaderId === currentUser?.id);
      } else {
        toast.error(result.message || "Failed to load team details");
      }
    } catch (error) {
      console.error("Error loading team:", error);
      toast.error("Failed to load team details");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset edit data when starting to edit
      setEditData({
        teamName: team.name,
        description: team.description || "",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editData.teamName.trim()) {
        toast.error("Team name cannot be empty");
        return;
      }

      const result = await updateTeam(teamId, {
        teamName: editData.teamName.trim(),
        description: editData.description.trim(),
      });

      if (result.success) {
        // Update local state
        setTeam((prev) => ({
          ...prev,
          name: editData.teamName.trim(),
          description: editData.description.trim(),
        }));

        setIsEditing(false);
        toast.success("Team details updated successfully!");
      } else {
        toast.error(result.message || "Failed to update team details");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team details");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      if (isLeader && team.members.length > 1) {
        toast.error("You must transfer leadership before leaving the team");
        return;
      }

      const confirmed = window.confirm(
        isLeader
          ? "Are you sure you want to disband this team? This cannot be undone."
          : "Are you sure you want to leave this team?"
      );

      if (!confirmed) return;

      const result = await leaveTeam(teamId);

      if (result.success) {
        toast.success(
          isLeader ? "Team disbanded successfully" : "Left team successfully"
        );

        navigate(`/hackathons/${hackathonId}/teams/select`);
      } else {
        toast.error(result.message || "Failed to leave team");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to remove this member?"
      );
      if (!confirmed) return;

      const result = await removeMember(teamId, memberId);

      if (result.success) {
        // Reload team data
        await loadTeam();
        toast.success("Member removed successfully");
      } else {
        toast.error(result.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600">Team not found</h2>
        <Link to={`/hackathons/${hackathonId}/teams/select`}>
          <Button variant="outline" className="mt-4">
            Back to Team Selection
          </Button>
        </Link>
      </div>
    );
  }

  const availableSpots = (team.maxMembers || 4) - team.memberCount;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            {isEditing ? (
              <Input
                value={editData.teamName}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, teamName: e.target.value }))
                }
                className="text-3xl font-bold border-dashed"
                maxLength={50}
              />
            ) : (
              <span>{team.name}</span>
            )}
            {isLeader && (
              <Crown
                className="h-6 w-6 text-yellow-500"
                title="You are the team leader"
              />
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            Team for{" "}
            <span className="font-semibold">{currentHackathon?.title}</span>
          </p>
        </div>

        {isLeader && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveChanges} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleEditToggle} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Members</span>
            </div>
            <p className="text-2xl font-bold">
              {team.memberCount}/{team.maxMembers || 4}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Available Spots</span>
            </div>
            <p className="text-2xl font-bold">{availableSpots}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Created</span>
            </div>
            <p className="text-sm font-medium">
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Badge variant={availableSpots > 0 ? "outline" : "secondary"}>
              {availableSpots > 0 ? "Recruiting" : "Full"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Team Description */}
          <Card>
            <CardHeader>
              <CardTitle>Team Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your team's vision, goals, or what you're working on..."
                  rows={4}
                  maxLength={500}
                />
              ) : (
                <p className="text-muted-foreground">
                  {team.description || "No description provided yet."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableSpots > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Recruit Team Members
                    </h4>
                    <p className="text-sm text-blue-600">
                      You have {availableSpots} spot
                      {availableSpots !== 1 ? "s" : ""} available
                    </p>
                  </div>
                  <Link to={`/hackathons/${hackathonId}/teams/browse`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Find Members
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-800">Start Building</h4>
                  <p className="text-sm text-green-600">
                    Submit your project when you're ready
                  </p>
                </div>
                <Link to={`/hackathons/${hackathonId}/submit`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Submit Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({team.memberCount})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members?.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.username?.[0] || member.fullName?.[0] || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.fullName || member.username}
                          {member.role === "leader" && (
                            <Crown className="inline h-4 w-4 ml-2 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{member.username}
                        </p>
                        {member.joinedAt && (
                          <p className="text-xs text-muted-foreground">
                            Joined{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          member.role === "leader" ? "default" : "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                      {isLeader && member.role !== "leader" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                      {member.username && (
                        <Link
                          to={`/portfolio?username=${member.username}`}
                          target="_blank"
                        >
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLeader ? (
                <>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Team Leadership
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      As team leader, you can manage team settings,
                      invite/remove members, and make important decisions.
                    </p>
                    {team.members.length > 1 && (
                      <p className="text-xs text-yellow-600">
                        💡 You can transfer leadership to another member in the
                        Members tab.
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      {team.members.length > 1
                        ? "Transfer leadership or remove all members before leaving the team."
                        : "Leaving will disband the team permanently."}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLeaveTeam}
                      disabled={team.members.length > 1 && isLeader}
                    >
                      {team.members.length > 1 && isLeader
                        ? "Cannot Leave (Transfer Leadership First)"
                        : "Leave Team"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Team Member
                    </h4>
                    <p className="text-sm text-blue-700">
                      You're a member of this team. Contact the team leader for
                      any changes or questions.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">
                      Leave Team
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      You can leave this team at any time. This action cannot be
                      undone.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleLeaveTeam}
                    >
                      Leave Team
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Back button */}
      <div className="text-center">
        <Link to={`/hackathons/${hackathonId}`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hackathon
          </Button>
        </Link>
      </div>
    </div>
  );
}
