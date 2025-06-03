import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FALLBACK_THUMBNAIL =
  "https://placehold.co/600x400?text=Hackathon+Thumbnail";

export default function HackathonCard({ hackathon }) {
  return (
    <Card className="mb-6 py-0 hover:scale-[1.02] transition-transform duration-200 shadow-md">
      <CardContent className="p-0">
        <img
          src={hackathon.thumbnail || FALLBACK_THUMBNAIL}
          alt={hackathon.title}
          className="w-full object-cover rounded-t"
        />
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">{hackathon.title}</h2>
            <Badge variant="outline">{hackathon.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {Array.isArray(hackathon.themes) &&
              hackathon.themes.map((theme) => (
                <Badge key={theme} variant="secondary">
                  {theme}
                </Badge>
              ))}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Organized by:{" "}
            <span className="font-medium">{hackathon.organizeBy}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            Registration:{" "}
            {hackathon.registrationDeadline
              ? new Date(hackathon.registrationDeadline).toLocaleDateString()
              : "N/A"}
            {" | "}
            Submission:{" "}
            {hackathon.submissionDeadline
              ? new Date(hackathon.submissionDeadline).toLocaleDateString()
              : "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">
            {hackathon.description?.slice(0, 80) || "No description."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
