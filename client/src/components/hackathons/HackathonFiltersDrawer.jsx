import HackathonFiltersSidebar from "./HackathonFiltersSidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function HackathonFiltersDrawer({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xs">
        <div className="p-4">
          <HackathonFiltersSidebar />
        </div>
      </DialogContent>
    </Dialog>
  );
}
