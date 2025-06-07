import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function HackathonFiltersSidebar() {
  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-8">
      <h2 className="font-semibold mb-4">More filters</h2>
      <div className="mb-4">
        <div className="font-medium mb-2">Status</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Upcoming
          </Button>
          <Button variant="outline" size="sm">
            Open
          </Button>
          <Button variant="outline" size="sm">
            Ended
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <div className="font-medium mb-2">Host</div>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select host" />
          </SelectTrigger>
          <SelectContent className={"z-100"}>
            <SelectItem value="OpenAI">OpenAI</SelectItem>
            <SelectItem value="Ethereum Foundation">
              Ethereum Foundation
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="font-medium mb-2">Open to</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Public
          </Button>
          <Button variant="outline" size="sm">
            Invite only
          </Button>
        </div>
      </div>
    </div>
  );
}
