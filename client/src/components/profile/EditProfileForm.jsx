// src/components/profile/EditProfileForm.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditProfileForm() {
  return (
    <Card className="bg-neutral-900 text-white">
      <CardContent className="p-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter your username" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" placeholder="Tell us about yourself" />
        </div>
      </CardContent>
    </Card>
  );
}
