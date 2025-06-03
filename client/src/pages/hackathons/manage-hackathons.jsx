import { useEffect, useRef, useState } from "react";
import useHackathonStore from "@/store/hackathon-store";
import HackathonFiltersBar from "@/components/manage-hackathons/HackathonFiltersBar";
import HackathonFiltersDrawer from "@/components/manage-hackathons/HackathonFiltersDrawer";
import HackathonMasonryGrid from "@/components/manage-hackathons/HackathonMasonryGrid";
import HackathonPagination from "@/components/manage-hackathons/HackathonPagination";

export default function ManageHackathonsPage() {
  const {
    hackathons,
    total,
    loading,
    filters,
    page,
    pageSize,
    setFilters,
    setPage,
    fetchHackathons,
  } = useHackathonStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep track of previous filters to detect keystroke changes
  const prevFilters = useRef(filters);

  useEffect(() => {
    let timer;
    // If only search or text filter changed, debounce
    if (filters.search !== prevFilters.current.search) {
      timer = setTimeout(() => {
        fetchHackathons();
      }, 5000);
    } else {
      // For other changes (like page), call immediately
      fetchHackathons();
    }
    prevFilters.current = filters;
    return () => clearTimeout(timer);
  }, [filters, page]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <HackathonFiltersBar
        filters={filters}
        setFilters={setFilters}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <HackathonFiltersDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        filters={filters}
        setFilters={setFilters}
      />
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      ) : (
        <HackathonMasonryGrid hackathons={hackathons} />
      )}
      <HackathonPagination
        page={page}
        setPage={setPage}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}
