// src/components/profile/EditProfileSocials.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProfileSocials() {
  return (
    <Card className="bg-neutral-900 text-white">
      <CardContent className="p-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" placeholder="github.com/yourusername" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" placeholder="linkedin.com/in/you" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input id="twitter" placeholder="@yourhandle" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="yourwebsite.com" />
        </div>
      </CardContent>
    </Card>
  );
}
