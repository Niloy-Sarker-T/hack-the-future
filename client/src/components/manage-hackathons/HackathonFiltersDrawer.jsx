import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

export default function HackathonFiltersDrawer({
  open,
  setOpen,
  filters,
  setFilters,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xs">
        <div className="space-y-4">
          <Input
            placeholder="Search by name"
            value={filters.search}
            onChange={(e) => {
              filters.search = e.target.value || "";
              setFilters({ ...filters });
            }}
          />
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => {
              filters.status = value === "all" ? "" : value;
              setFilters({ ...filters });
            }}
          >
            <SelectTrigger>
              {filters.status
                ? filters.status.charAt(0).toUpperCase() +
                  filters.status.slice(1)
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
          <ThemesMultiSelect options={THEME_OPTIONS} />
          <Button className="w-full" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
