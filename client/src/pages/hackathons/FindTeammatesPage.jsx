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
  Mail,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import ParticipantCard from "@/components/teams/ParticipantCard";

export default function FindTeammatesPage() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { currentHackathon, getHackathonById } = useHackathonStore();
  const {
    participants,
    getAvailableParticipants,
    loading: teamStoreLoading,
  } = useTeamStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  useEffect(() => {
    loadData();
  }, [hackathonId]);

  useEffect(() => {
    // Filter participants based on search query
    if (searchQuery.trim()) {
      const filtered = participants.filter(
        (participant) =>
          participant.fullName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          participant.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          participant.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          participant.skills?.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(participants);
    }
  }, [searchQuery, participants]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load hackathon data if needed
      if (!currentHackathon || currentHackathon.id !== hackathonId) {
        await getHackathonById(hackathonId);
      }

      // Load available participants (not part of any team)
      await loadParticipants();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      await getAvailableParticipants(hackathonId);
    } catch (error) {
      console.error("Error loading participants:", error);
      toast.error("Failed to load participants");
    }
  };

  const handleInviteParticipant = async (participantId) => {
    try {
      // TODO: Implement team invitation system
      // This would either:
      // 1. Send a direct invitation to join your existing team
      // 2. Start a conversation to form a new team together

      toast.info("Invitation feature coming soon!", {
        description:
          "For now, you can contact participants directly to collaborate",
      });

      // Placeholder for actual implementation:
      // await apiClient.post(`/teams/invite`, {
      //   participantId,
      //   hackathonId,
      //   message: "Would you like to join our team?"
      // });
    } catch (error) {
      console.error("Error inviting participant:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleRefresh = () => {
    loadParticipants();
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
        <h1 className="text-3xl font-bold">Find Teammates</h1>
        <p className="text-lg text-muted-foreground">
          Connect with individual participants for{" "}
          <span className="font-semibold">{currentHackathon?.title}</span>
        </p>
        <Badge variant="outline">
          {filteredParticipants.length} participant
          {filteredParticipants.length !== 1 ? "s" : ""} available
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or interests..."
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

      {/* Participants Grid */}
      {filteredParticipants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {participants.length === 0 ? (
              <>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Available Participants
                </h3>
                <p className="text-muted-foreground mb-6">
                  All participants have already formed teams or there are no
                  solo participants yet.
                </p>
                <div className="space-y-4">
                  <Link to={`/hackathons/${hackathonId}/teams/browse`}>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Browse Existing Teams
                    </Button>
                  </Link>
                  <div>
                    <Link to={`/hackathons/${hackathonId}/teams/create`}>
                      <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Your Own Team
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Participants Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  No participants match your search criteria.
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
          {filteredParticipants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onInvite={() => handleInviteParticipant(participant.id)}
              hackathonId={hackathonId}
            />
          ))}
        </div>
      )}

      {/* Create Team CTA */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="text-center py-6">
          <h3 className="font-semibold mb-2 text-blue-800">
            Ready to form a team?
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Create your team and invite the participants you want to work with!
          </p>
          <Link to={`/hackathons/${hackathonId}/teams/create`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Team
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Browse Teams Alternative */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="text-center py-6">
          <h3 className="font-semibold mb-2 text-green-800">
            Looking for existing teams instead?
          </h3>
          <p className="text-sm text-green-700 mb-4">
            Browse teams that are already looking for additional members.
          </p>
          <Link to={`/hackathons/${hackathonId}/teams/browse`}>
            <Button
              variant="outline"
              className="border-green-600 text-green-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Browse Teams
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Communication Tips */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-4">
          <h3 className="font-semibold mb-3 text-purple-800 flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Collaboration Tips:</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-purple-700">
            <div>
              <p className="font-medium mb-1">• Be Clear About Goals</p>
              <p>Share your project ideas and what you hope to achieve</p>
            </div>
            <div>
              <p className="font-medium mb-1">• Complementary Skills</p>
              <p>Look for teammates with skills that complement yours</p>
            </div>
            <div>
              <p className="font-medium mb-1">• Time Commitment</p>
              <p>Discuss availability and expected time investment</p>
            </div>
            <div>
              <p className="font-medium mb-1">• Communication Style</p>
              <p>
                Ensure you can work well together and communicate effectively
              </p>
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
