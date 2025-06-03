import HackathonCard from "./HackathonCard";

export default function HackathonMasonryGrid({ hackathons }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 space-y-6 animate-fade-in-up mb-8">
      {hackathons.length === 0 && (
        <div className="text-center col-span-full text-muted-foreground py-12">
          No hackathons found.
        </div>
      )}
      {hackathons.map((h) => (
        <HackathonCard key={h.id} hackathon={h} />
      ))}
    </div>
  );
}
