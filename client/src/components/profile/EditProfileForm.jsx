// src/components/profile/EditProfileForm.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

export default function EditProfileForm() {
  return (
    <Card className="bg-neutral-900 text-gray-300">
      <CardContent className="p-6 grid gap-4">
        <div>
          <h2 className="text-lg font-bold">Basic Information</h2>
          <span className="text-sm">Update your name, username, and bio</span>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" placeholder="Enter your fullname" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">User Name</Label>
          <Input id="username" placeholder="Enter your username" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            className="h-8"
            id="bio"
            placeholder="Tell us about yourself"
          />
        </div>
      </CardContent>
    </Card>
  );
}
