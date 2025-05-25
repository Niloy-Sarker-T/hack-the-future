// src/pages/profile/EditProfilePage.tsx
import EditProfileForm from "@/components/profile/EditProfileForm";
import EditProfilePicture from "@/components/profile/EditProfilePicture";
import EditProfileSocials from "@/components/profile/EditProfileSocials";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

export default function EditProfilePage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto bg-black text-white px-6 py-8">
      <div className="space-y-1 mb-8">
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <span>
              <ArrowLeftIcon />
            </span>
          </Link>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>
        <p className="text-sm text-gray-400">
          Update your personal info and social links.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <EditProfilePicture />
        <EditProfileForm />
        <EditProfileSocials />
      </div>
      <div className="flex justify-end mt-6">
        <Button type="submit">Save Changes</Button>
      </div>
    </main>
  );
}
