import { Button } from "@/components/ui/button";

export default function HackathonPagination({
  page,
  setPage,
  total,
  pageSize,
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </Button>
      <span className="px-4 py-2">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
