import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">HACK THE</span>
            <span className="text-[#14B8A6]"> FUTURE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Bangladesh&apos;s Premier Hackathon Platform
          </p>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect, collaborate, and create innovative solutions with the
            brightest minds across Bangladesh. From ideation to implementation,
            we provide the tools you need to succeed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white px-6 py-6 text-lg">
              Organize a Hackathon
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white px-6 py-6 text-lg"
            >
              Join an Event
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#14B8A6]" />
              <span>10+ Upcoming Events</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-[#14B8A6]" />
              <span>5,000+ Registered Hackers</span>
            </div>
            <div className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-[#14B8A6]" />
              <span>৳50,00,000+ in Prizes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
