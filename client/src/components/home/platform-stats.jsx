export default function PlatformStats({ stats }) {
  return (
    <section className="py-16 px-4 bg-muted">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-3xl font-bold">{stats.totalHackathons}</p>
          <p className="text-muted-foreground">Hackathons</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{stats.totalParticipants}</p>
          <p className="text-muted-foreground">Participants</p>
        </div>
        <div>
          <p className="text-3xl font-bold">
            ${stats.totalPrize.toLocaleString()}
          </p>
          <p className="text-muted-foreground">Prize Money</p>
        </div>
        <div>
          <p className="text-3xl font-bold">{stats.totalCities}</p>
          <p className="text-muted-foreground">Cities Covered</p>
        </div>
      </div>
    </section>
  );
}
