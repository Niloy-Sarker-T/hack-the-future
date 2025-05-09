import { Button } from "@/components/ui/button"
import { Building, Award, ArrowRight } from "lucide-react"

export default function Sponsors() {
  const sponsors = [
    { name: "ICT Division", tier: "platinum" },
    { name: "Bangladesh Bank", tier: "gold" },
    { name: "Grameenphone", tier: "gold" },
    { name: "bKash", tier: "gold" },
    { name: "Robi Axiata", tier: "silver" },
    { name: "Nagad", tier: "silver" },
    { name: "BASIS", tier: "silver" },
    { name: "BUET", tier: "university" },
    { name: "DU", tier: "university" },
    { name: "NSU", tier: "university" },
    { name: "BRAC University", tier: "university" },
    { name: "KUET", tier: "university" },
  ]

  return (
    <section id="sponsors" className="py-16 md:py-24 bg-[#121212]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Sponsors</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Supported by leading organizations and institutions across Bangladesh
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Building className="mr-2 h-5 w-5 text-[#14B8A6]" />
            Corporate Partners
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors
              .filter((sponsor) => ["platinum", "gold", "silver"].includes(sponsor.tier))
              .map((sponsor, index) => (
                <div
                  key={index}
                  className={`
                    p-6 flex items-center justify-center rounded-lg border
                    ${sponsor.tier === "platinum" ? "bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#14B8A6]" : ""}
                    ${sponsor.tier === "gold" ? "bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A]" : ""}
                    ${sponsor.tier === "silver" ? "bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A]" : ""}
                  `}>
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto bg-[#14B8A6]/10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-[#14B8A6]">{sponsor.name.charAt(0)}</span>
                    </div>
                    <p className="font-medium text-white">{sponsor.name}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{sponsor.tier} Sponsor</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Award className="mr-2 h-5 w-5 text-[#14B8A6]" />
            Academic Partners
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sponsors
              .filter((sponsor) => sponsor.tier === "university")
              .map((sponsor, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
                  <div className="text-center">
                    <p className="font-medium text-white text-sm">{sponsor.name}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Become a Sponsor</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Support innovation in Bangladesh and connect with the brightest tech talents. Our sponsorship packages offer
            visibility, recruitment opportunities, and more.
          </p>
          <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white">
            Get Sponsorship Details
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

