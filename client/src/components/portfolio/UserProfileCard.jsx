import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

export default function UserProfileCard({ user }) {
  return (
    <Card className="w-full md:h-full flex flex-col items-center p-6">
      <Avatar className="w-24 h-24 mb-3">
        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
      </Avatar>
      <CardTitle className="text-xl">{user.fullName}</CardTitle>
      <div className="flex gap-2 mt-2 w-full sm:w-[70%] items-center justify-between">
        <a
          key="github"
          href={user?.socialLinks?.github || "#"}
          className={`${
            user?.socialLinks?.github
              ? "text-slate-700 hover:text-slate-600 text-lg"
              : "pointer-events-none text-gray-400"
          }`}
          title="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-6 w-6" />
        </a>
        <a
          key="linkedin"
          href={user?.socialLinks?.linkedin || "#"}
          className={`${
            user?.socialLinks?.linkedin
              ? "text-blue-500 hover:text-blue-600 text-lg"
              : "pointer-events-none text-gray-400"
          }`}
          title="linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-6 w-6" />
        </a>
        <a
          key="twitter"
          href={user?.socialLinks?.twitter || "#"}
          className={`${
            user?.socialLinks?.twitter
              ? "text-neutral-900 hover:text-neutral-700 text-lg"
              : "pointer-events-none text-gray-400"
          }`}
          title="twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-6 w-6" />
        </a>
        <a
          key="website"
          href={user?.socialLinks?.website || "#"}
          className={`${
            user?.socialLinks?.website
              ? "text-indigo-400 hover:text-indigo-300 text-lg"
              : "pointer-events-none text-gray-400"
          }`}
          title="website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-6 w-6" />
        </a>
      </div>
    </Card>
  );
}
