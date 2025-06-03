import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import ThemesMultiSelect from "./theme-multiselect";

const THEME_OPTIONS = [
  "Beginner Friendly",
  "Machine Learning/AI",
  "Web",
  "Blockchain",
  "Mobile",
  "Health",
  "Education",
  "Gaming",
  "Fintech",
  "IoT",
  "Cybersecurity",
  "DevOps",
  "Productivity",
  "Design",
  "AR/VR",
  "Social Good",
];

export default function HackathonFiltersBar({
  filters,
  setFilters,
  onOpenDrawer,
}) {
  return (
    <div className="flex flex-row gap-2 items-center mb-6 animate-fade-in-down">
      <Input
        placeholder="Search by name"
        value={filters.search}
        onChange={(e) => {
          filters.search = e.target.value || "";
          setFilters({ ...filters });
        }}
      />
      <div className="hidden sm:block min-w-[140px]">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => {
            filters.status = value === "all" ? "" : value;
            setFilters({ ...filters });
          }}
        >
          <SelectTrigger>
            {filters.status
              ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1)
              : "All Status"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="hidden sm:block min-w-[180px]">
        <ThemesMultiSelect options={THEME_OPTIONS} />
      </div>
      <Button
        variant="outline"
        className="ml-auto sm:hidden"
        onClick={onOpenDrawer}
        type="button"
      >
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
    </div>
  );
}
