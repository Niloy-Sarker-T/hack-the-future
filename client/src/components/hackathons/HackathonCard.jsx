import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HackathonThemeChips from "./HackathonThemeChips";
import { Link } from "react-router-dom";

export default function HackathonCard({ hackathon }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{hackathon.title}</CardTitle>
            <Badge className="text-sm bg-primary/20 text-muted-foreground mt-1">
              by {hackathon.organizeBy}
            </Badge>
          </div>
          <Badge
            className={`text-sm ${
              hackathon.status === "upcoming"
                ? "bg-green-100 text-green-800"
                : hackathon.status === "ongoing"
                ? "bg-primary/10"
                : hackathon.status === "end"
                ? "bg-red-200 text-red-500"
                : "bg-yellow-100/30 text-yellow-400"
            }`}
          >
            {hackathon.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <HackathonThemeChips themes={hackathon.themes} />
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-muted-foreground">Registration:</span>
            <div className="font-medium">
              {hackathon.registrationDeadline
                ? new Date(hackathon.registrationDeadline).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Submission:</span>
            <div className="font-medium">
              {hackathon.submissionDeadline
                ? new Date(hackathon.submissionDeadline).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Link
          to={`/hackathons/${hackathon.id}`}
          className="bg-primary text-white px-4 py-2 rounded text-sm flex-1 text-center"
        >
          View Details
        </Link>
        <Link
          to={`/hackathons/${hackathon.id}/apply`}
          className="border border-primary text-primary px-4 py-2 rounded text-sm flex-1 text-center"
        >
          Apply Now
        </Link>
      </CardFooter>
    </Card>
  );
}
