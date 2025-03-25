import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, MapPin, Trophy, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    name: "Digital Bangladesh Hackathon",
    organizer: "ICT Division",
    date: "March 26-28, 2025",
    location: "Dhaka",
    prize: "৳10,00,000",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["AI", "Fintech", "Sustainability"],
    status: "Registering",
    deadline: "March 15, 2025",
  },
  {
    id: 2,
    name: "BUET CSE Fest Hackathon",
    organizer: "BUET CSE Society",
    date: "April 10-12, 2025",
    location: "Dhaka",
    prize: "৳5,00,000",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Robotics", "IoT", "ML"],
    status: "Registering",
    deadline: "March 30, 2025",
  },
  {
    id: 3,
    name: "Dhaka FinTech Summit",
    organizer: "Bangladesh Bank & BFIU",
    date: "May 5-7, 2025",
    location: "Dhaka",
    prize: "৳8,00,000",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Fintech", "Blockchain", "Security"],
    status: "Coming Soon",
    deadline: "April 20, 2025",
  },
]

export default function UpcomingEvents() {
  return (
    <section id="events" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the latest hackathons and innovation challenges happening across Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A] overflow-hidden hover:border-[#14B8A6] transition-all duration-300 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <div className="relative">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`
                    ${event.status === "Registering" ? "bg-green-600 hover:bg-green-700" : ""}
                    ${event.status === "Coming Soon" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    ${event.status === "Ongoing" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                  `}>
                    {event.status}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-xl font-bold text-white">{event.name}</h3>
                <p className="text-gray-400">{event.organizer}</p>
              </CardHeader>

              <CardContent className="space-y-4 pb-2">
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 text-[#14B8A6]" />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 text-[#14B8A6]" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Trophy className="h-4 w-4 mr-2 text-[#14B8A6]" />
                  <span>Prize Pool: {event.prize}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-[#14B8A6]" />
                  <span>Registration Deadline: {event.deadline}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-[#14B8A6] text-[#14B8A6]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <button
                  className="w-full py-2 text-center bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] rounded-md transition-colors">
                  View Details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="inline-flex items-center text-[#14B8A6] hover:text-[#0E9384] transition-colors">
            View All Events
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

