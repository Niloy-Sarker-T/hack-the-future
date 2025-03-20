import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import UpcomingEvents from "@/components/upcoming-events";
import Benefits from "@/components/benefits";
import SuccessStories from "@/components/success-stories";
import Sponsors from "@/components/sponsors";
import Footer from "@/components/footer";
import StatsCounter from "@/components/stats-counter";
import TeamFormation from "@/components/team-formation";
import BangladeshMap from "@/components/bangladesh-map";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <Navbar />
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
      <Footer />
    </div>
  );
}
