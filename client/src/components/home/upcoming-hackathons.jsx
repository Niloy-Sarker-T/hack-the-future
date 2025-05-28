export default function UpcomingHackathons({ hackathons }) {
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Hackathons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <div key={hackathon.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{hackathon.name}</h3>
            <p className="text-sm text-muted-foreground">
              {hackathon.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
