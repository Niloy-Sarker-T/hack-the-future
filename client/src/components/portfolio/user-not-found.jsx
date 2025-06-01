import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function UserNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center p-6">
        <CardHeader className="flex flex-col items-center gap-2">
          <AlertTriangle className="text-destructive w-10 h-10" />
          <CardTitle className="text-xl">User Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The user you’re looking for doesn’t exist or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
