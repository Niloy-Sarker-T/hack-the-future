import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HackathonThemeChips from "./HackathonThemeChips";

export default function HackathonCard({ hackathon }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative">
        <img
          src={hackathon.image || "/default-hackathon.jpg"}
          alt={hackathon.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={
              hackathon.status === "ongoing"
                ? "default"
                : hackathon.status === "upcoming"
                ? "secondary"
                : "destructive"
            }
            className={
              hackathon.status === "upcoming"
                ? "bg-primary/10 text-primary"
                : ""
            }
          >
            {hackathon.status}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{hackathon.title}</CardTitle>
        <Badge className="text-sm bg-primary/20 text-muted-foreground">
          {hackathon.organization ?? "demo"}
        </Badge>
      </CardHeader>
      <CardContent>
        <HackathonThemeChips themes={hackathon.themes} />
        <div className="text-xs text-muted-foreground mt-2 mb-4">
          {hackathon.registrationDeadline ?? "NaN"} –{" "}
          {hackathon.submissionDeadline ?? "NaN"}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <a
          href={`/hackathons/${hackathon.id}`}
          className="bg-primary text-white px-3 py-1 rounded text-sm"
        >
          Details
        </a>
        <a
          href={`/hackathons/${hackathon.id}/apply`}
          className="border border-primary text-primary px-3 py-1 rounded text-sm"
        >
          Apply
        </a>
      </CardFooter>
    </Card>
  );
}
