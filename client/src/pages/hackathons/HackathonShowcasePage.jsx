import HackathonFiltersSidebar from "@/components/hackathons/HackathonFiltersSidebar";
import HackathonGrid from "@/components/hackathons/HackathonGrid";
import HackathonSearchBar from "@/components/hackathons/HackathonSearchBar";
import HackathonFiltersDrawer from "@/components/hackathons/HackathonFiltersDrawer";
import { useEffect, useState } from "react";
import useHackathonStore from "@/store/hackathon-store";

export default function HackathonShowcasePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { hackathons, total, page, loading, fetchHackathons } =
    useHackathonStore();

  // Fetch hackathons when the component mounts
  useEffect(() => {
    fetchHackathons();
  }, [page, fetchHackathons]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-gray-500">Loading hackathons...</span>
      </div>
    );
  }

  console.log("hackathons[0]", hackathons[0]);
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-2 py-8">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <HackathonFiltersSidebar />
      </aside>
      {/* Drawer for mobile */}
      <HackathonFiltersDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <h1>All hackathons</h1>
            <span className="text-muted-foreground text-sm">
              Showing {total} hackathons
            </span>
          </div>
          <HackathonSearchBar onOpenFilters={() => setDrawerOpen(true)} />
        </div>
        <HackathonGrid hackathons={hackathons} />
      </main>
    </div>
  );
}
