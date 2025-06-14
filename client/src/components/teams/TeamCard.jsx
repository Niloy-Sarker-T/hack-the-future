import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TeamCard({ team, onJoin, hackathonId }) {
  const availableSpots = (team.maxMembers || 4) - team.memberCount;
  const isTeamFull = availableSpots <= 0;

  return (
    <Card
      className={`h-full ${
        isTeamFull ? "opacity-75" : "hover:shadow-lg transition-shadow"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-1">
              {team.name}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {team.memberCount}/{team.maxMembers || 4} members
              </span>
              <Badge
                variant={isTeamFull ? "secondary" : "outline"}
                className="text-xs"
              >
                {isTeamFull
                  ? "Full"
                  : `${availableSpots} spot${
                      availableSpots !== 1 ? "s" : ""
                    } left`}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team Description */}
        {team.description && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {team.description}
            </p>
          </div>
        )}

        {/* Team Leader */}
        {team.leader && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={team.leader.avatar} />
              <AvatarFallback className="text-xs">
                {team.leader.name?.[0] || "T"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Led by {team.leader.name || "Team Leader"}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Team Members Preview */}
        {team.members && team.members.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Team Members:
            </p>
            <div className="flex -space-x-2">
              {team.members.slice(0, 4).map((member, index) => (
                <Avatar
                  key={member.userId || index}
                  className="h-6 w-6 border-2 border-background"
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">
                    {member.username?.[0] || member.fullName?.[0] || "M"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.members.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">
                    +{team.members.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {!isTeamFull ? (
            <Button onClick={onJoin} className="flex-1" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Join Team
            </Button>
          ) : (
            <Button variant="secondary" disabled className="flex-1" size="sm">
              Team Full
            </Button>
          )}

          <Link to={`/hackathons/${hackathonId}/teams/${team.id}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Skills/Tags Preview */}
        {team.skills && team.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {team.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {team.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{team.skills.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
