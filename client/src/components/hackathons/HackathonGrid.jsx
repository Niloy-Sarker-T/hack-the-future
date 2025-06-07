import HackathonCard from "./HackathonCard";

export default function HackathonGrid({ hackathons }) {
  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="text-center text-gray-500">No hackathons found.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  );
}
