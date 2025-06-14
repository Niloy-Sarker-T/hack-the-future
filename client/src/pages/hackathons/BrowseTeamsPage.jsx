import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useHackathonStore from "@/store/hackathon-store";
import useTeamStore from "@/store/team-store";
import apiClient from "@/lib/axios-setup";
import {
  ArrowLeft,
  Users,
  Search,
  Loader2,
  UserPlus,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import TeamCard from "@/components/teams/TeamCard";

export default function BrowseTeamsPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { currentHackathon, getHackathonById } = useHackathonStore();
  const { teams, getTeamsByHackathon, joinTeam } = useTeamStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    loadData();
  }, [hackathonId]);

  useEffect(() => {
    // Filter teams based on search query and available spots
    let filtered = teams;

    // Filter to only show teams with available spots
    filtered = filtered.filter(
      (team) => team.memberCount < (team.maxMembers || 4)
    );

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load hackathon data if needed
      if (!currentHackathon || currentHackathon.id !== hackathonId) {
        await getHackathonById(hackathonId);
      }

      // Load teams for this hackathon
      await loadTeams();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      console.log("Loading teams for hackathon:", hackathonId);
      const result = await getTeamsByHackathon(hackathonId);
      console.log("Teams API result:", result);
      if (!result.success) {
        console.error("Failed to load teams:", result.message);
        toast.error(result.message || "Failed to load teams");
      } else {
        console.log("Teams loaded successfully:", result.data);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      toast.error("Failed to load teams");
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const result = await joinTeam(teamId);

      if (result.success) {
        toast.success("🎉 Successfully joined the team!", {
          description:
            "You're now part of the team and can start collaborating",
          duration: 5000,
        });

        // Navigate to team dashboard
        navigate(`/hackathons/${hackathonId}/teams/${teamId}`);
      } else {
        toast.error(result.message || "Failed to join team");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team");
    }
  };

  const handleRefresh = () => {
    loadTeams();
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
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Browse Teams</h1>
        <p className="text-lg text-muted-foreground">
          Find and join existing teams for{" "}
          <span className="font-semibold">{currentHackathon?.title}</span>
        </p>
        <Badge variant="outline">
          {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""}{" "}
          available
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {teams.length === 0 ? (
              <>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a team for this hackathon!
                </p>
                <Link to={`/hackathons/${hackathonId}/teams/create`}>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create First Team
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Teams Found</h3>
                <p className="text-muted-foreground mb-4">
                  No teams match your search criteria.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onJoin={() => handleJoinTeam(team.id)}
              hackathonId={hackathonId}
            />
          ))}
        </div>
      )}

      {/* Team Creation CTA */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="text-center py-6">
          <h3 className="font-semibold mb-2 text-blue-800">
            Don't see a team that fits?
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Create your own team and let others join you!
          </p>
          <Link to={`/hackathons/${hackathonId}/teams/create`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Find Teammates Alternative */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="text-center py-6">
          <h3 className="font-semibold mb-2 text-purple-800">
            Want to connect with individual participants?
          </h3>
          <p className="text-sm text-purple-700 mb-4">
            Browse individual participants and form your own team organically.
          </p>
          <Link to={`/hackathons/${hackathonId}/teams/find`}>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Find Teammates
            </Button>
          </Link>
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
