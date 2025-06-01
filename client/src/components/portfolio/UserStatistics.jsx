import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trophy, Code2, Award } from "lucide-react";

export default function UserStatistics({ username, statistics }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:gap-6 justify-between sm:items-center gap-10">
          <Link
            to={`/portfolio/${username}?tab=hackathons`}
            className="flex items-center gap-3 cursor-pointer"
            title="Hackathons"
          >
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-500" />
              <span className="font-semibold">
                {statistics?.hackathons || 0}
              </span>
              <span className="text-muted-foreground">Hackathons</span>
            </div>
          </Link>
          <Link
            to={`/portfolio/${username}?tab=projects`}
            className="flex items-center gap-3 cursor-pointer"
            title="Projects"
          >
            <div className="flex items-center gap-3">
              <Code2 className="text-blue-500" />
              <span className="font-semibold">{statistics?.projects || 0}</span>
              <span className="text-muted-foreground">Projects</span>
            </div>
          </Link>
          <Link
            to={`/portfolio/${username}?tab=achievements`}
            className="flex items-center gap-3 cursor-pointer"
            title="Achievements"
          >
            <div className="flex items-center gap-3">
              <Award className="text-green-500" />
              <span className="font-semibold">
                {statistics?.achievements || 0}
              </span>
              <span className="text-muted-foreground">Achievements</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
