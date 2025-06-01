import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserInterests({ interests }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <Badge key={interest} variant="outline">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
