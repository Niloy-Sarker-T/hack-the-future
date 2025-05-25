import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditProfilePicture() {
  return (
    <Card className="bg-neutral-900 text-white">
      <CardContent className="p-6 grid gap-4 items-center justify-center text-center">
        <div className="text-sm text-gray-400">Profile Picture</div>
        <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto" />
        <Button variant="outline" className="bg-slate-800">
          Change
        </Button>
      </CardContent>
    </Card>
  );
}
