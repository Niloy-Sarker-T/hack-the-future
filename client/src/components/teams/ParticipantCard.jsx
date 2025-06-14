import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  Mail,
  MessageCircle,
  ExternalLink,
  Star,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ParticipantCard({
  participant,
  onInvite,
  hackathonId,
}) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={participant.avatarUrl} />
            <AvatarFallback>
              {participant.fullName?.[0] || participant.username?.[0] || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 line-clamp-1">
              {participant.fullName || participant.username}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              @{participant.username}
            </p>
            {participant.lookingForTeam && (
              <Badge variant="outline" className="mt-1 text-xs">
                Looking for team
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {participant.bio && (
          <div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {participant.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {participant.skills && participant.skills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Skills:
            </p>
            <div className="flex flex-wrap gap-1">
              {participant.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {participant.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{participant.skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {participant.interests && participant.interests.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Interests:
            </p>
            <div className="flex flex-wrap gap-1">
              {participant.interests.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {participant.interests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{participant.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Experience Level */}
        {participant.experienceLevel && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>Experience: {participant.experienceLevel}</span>
          </div>
        )}

        {/* Location */}
        {participant.location && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{participant.location}</span>
          </div>
        )}

        {/* Participation Type */}
        <div className="flex items-center justify-between text-xs">
          <Badge
            variant={
              participant.participationType === "solo" ? "secondary" : "outline"
            }
            className="text-xs"
          >
            {participant.participationType} participant
          </Badge>
          {participant.lookingForTeam && (
            <span className="text-green-600 font-medium">
              Open to collaborate
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button onClick={onInvite} className="flex-1" size="sm">
            <UserPlus className="h-4 w-4 mr-1" />
            Invite
          </Button>

          {participant.username && (
            <Link to={`/portfolio/${participant.username}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Contact Options */}
        {participant.contactPreferences && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Preferred Contact:</p>
            <div className="flex space-x-2">
              {participant.contactPreferences.includes("email") && (
                <Badge variant="outline" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Badge>
              )}
              {participant.contactPreferences.includes("chat") && (
                <Badge variant="outline" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Team Preferences */}
        {participant.teamPreferences && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Looking for:</p>
            <p className="line-clamp-2">{participant.teamPreferences}</p>
          </div>
        )}

        {/* Previous Hackathons */}
        {participant.hackathonCount && participant.hackathonCount > 0 && (
          <div className="text-xs text-muted-foreground">
            <span>
              🏆 {participant.hackathonCount} hackathon
              {participant.hackathonCount !== 1 ? "s" : ""} completed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
