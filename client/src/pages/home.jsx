import {
  HeroSection,
  TrustedCompanies,
  SearchHackathons,
  FeaturedHackathons,
  PlatformStats,
  UpcomingHackathons,
} from "@/components/home";

export default function HomePage() {
  const upcoming = [
    { id: "1", name: "BD AI Hack", description: "Join AI talents across BD." },
    {
      id: "2",
      name: "Green Innovation",
      description: "Hack for sustainability.",
    },
  ];
  const featured = [
    {
      id: "3",
      name: "Code for BD",
      description: "Showcase your coding skills.",
    },
    {
      id: "4",
      name: "HealthHack",
      description: "Healthcare meets innovation.",
    },
  ];
  const stats = {
    totalHackathons: 128,
    totalParticipants: 5400,
    totalPrize: 250000,
    totalCities: 18,
  };

  return (
    <main>
      <HeroSection />
      <TrustedCompanies />
      <SearchHackathons />
      <UpcomingHackathons hackathons={upcoming} />
      <FeaturedHackathons hackathons={featured} />
      <PlatformStats stats={stats} />
    </main>
  );
}
