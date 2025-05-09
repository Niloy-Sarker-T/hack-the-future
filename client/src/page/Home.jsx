import Navbar from "@/components/navbar";
import Hero from "@/components/home/hero";
import UpcomingEvents from "@/components/home/upcoming-events";
import Benefits from "@/components/home/benefits";
import SuccessStories from "@/components/home/success-stories";
import Sponsors from "@/components/home/sponsors";
import Footer from "@/components/footer";
import StatsCounter from "@/components/home/stats-counter";
import TeamFormation from "@/components/home/team-formation";
import BangladeshMap from "@/components/home/bangladesh-map";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <main>
        <Hero />
        <StatsCounter />
        <UpcomingEvents />
        <Benefits />
        <TeamFormation />
        <BangladeshMap />
        <SuccessStories />
        <Sponsors />
      </main>
    </div>
  );
}
