import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const successStories = [
  {
    id: 1,
    event: "Digital Bangladesh Hackathon 2024",
    team: "CodeCrafters",
    project: "AgriTech Solution",
    metrics: {
      participants: 450,
      projects: 85,
      universities: 12,
    },
    testimonial:
      "The platform made team formation incredibly easy. We found members with complementary skills and went on to win the grand prize!",
    person: "Rahima Khan",
    role: "Team Lead, CodeCrafters",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    event: "FinTech Innovation Challenge",
    team: "PayEase",
    project: "Micro-lending Platform",
    metrics: {
      participants: 320,
      projects: 64,
      universities: 8,
    },
    testimonial:
      "The judging system was transparent and the feedback we received was invaluable for improving our solution after the hackathon.",
    person: "Tanvir Ahmed",
    role: "Developer, PayEase",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default function SuccessStories() {
  return (
    <section id="stories" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how hack-the-future has helped teams achieve their innovation
            goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A] overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl text-white font-bold mb-1">
                    {story.event}
                  </h3>
                  <p className="text-[#14B8A6]">
                    {story.team} • {story.project}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[120px] p-3 bg-[#121212] rounded-lg">
                    <p className="text-2xl font-bold text-white">
                      {story.metrics.participants}
                    </p>
                    <p className="text-xs text-gray-400">Participants</p>
                  </div>
                  <div className="flex-1 min-w-[120px] p-3 bg-[#121212] rounded-lg">
                    <p className="text-2xl font-bold text-white">
                      {story.metrics.projects}
                    </p>
                    <p className="text-xs text-gray-400">Projects</p>
                  </div>
                  <div className="flex-1 min-w-[120px] p-3 bg-[#121212] rounded-lg">
                    <p className="text-2xl font-bold text-white">
                      {story.metrics.universities}
                    </p>
                    <p className="text-xs text-gray-400">Universities</p>
                  </div>
                </div>

                <div className="relative p-4 bg-[#121212] rounded-lg mb-6">
                  <Quote className="absolute top-4 left-4 h-6 w-6 text-[#14B8A6] opacity-20" />
                  <p className="text-gray-300 italic pl-6">
                    "{story.testimonial}"
                  </p>
                </div>

                <div className="flex items-center">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.person}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{story.person}</p>
                    <p className="text-sm text-gray-400">{story.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Join the community of innovators and create your own success story
          </p>
        </div>
      </div>
    </section>
  );
}
