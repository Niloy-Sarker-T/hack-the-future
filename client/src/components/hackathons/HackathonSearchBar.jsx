import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export default function HackathonSearchBar({ onOpenFilters }) {
  return (
    <div className="flex gap-2 items-center justify-stretch w-full lg:w-auto">
      <div className="flex flex-1 items-center">
        <Input className="rounded-l-lg" placeholder="Search hackathons" />
        <Button className="rounded-l-none" variant="default">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 h-5" />
        </Button>
      </div>
      <Button className="lg:hidden" variant="outline" onClick={onOpenFilters}>
        More
      </Button>
    </div>
  );
}
