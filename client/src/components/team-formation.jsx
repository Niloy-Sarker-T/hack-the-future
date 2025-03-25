import { Button } from "@/components/ui/button"
import { BrainCircuit, Users, Sparkles } from "lucide-react"

export default function TeamFormation() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>AI-Powered Feature</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">Find Your Perfect Team with AI Matching</h2>

            <p className="text-gray-300 mb-6">
              Our intelligent team formation assistant analyzes skills, experience, and interests to suggest optimal
              team compositions for hackathon success.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                </div>
                <div>
                  <span className="font-medium text-white">Skill-Based Matching</span>
                  <p className="text-gray-400 text-sm mt-1">Find teammates with complementary technical skills</p>
                </div>
              </li>

              <li className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                </div>
                <div>
                  <span className="font-medium text-white">Interest Alignment</span>
                  <p className="text-gray-400 text-sm mt-1">Connect with people who share your project vision</p>
                </div>
              </li>

              <li className="flex items-start">
                <div
                  className="w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                </div>
                <div>
                  <span className="font-medium text-white">Diversity Optimization</span>
                  <p className="text-gray-400 text-sm mt-1">Create balanced teams with diverse perspectives</p>
                </div>
              </li>
            </ul>

            <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white">
              Try Team Matching
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/20 to-transparent rounded-lg opacity-30 blur-xl"></div>
            <div
              className="relative bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div
                  className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mr-4">
                  <BrainCircuit className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <h3 className="text-xl font-bold">Team Formation Assistant</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#121212] rounded-lg border border-[#2A2A2A]">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                      JS
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jahid Sarkar</p>
                      <p className="text-xs text-gray-400">Frontend Developer • BUET</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">UI/UX</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">TypeScript</span>
                  </div>
                </div>

                <div className="p-4 bg-[#121212] rounded-lg border border-[#2A2A2A]">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mr-3">
                      TR
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tasnim Rahman</p>
                      <p className="text-xs text-gray-400">Backend Developer • DU</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">Node.js</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">MongoDB</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">Express</span>
                  </div>
                </div>

                <div className="p-4 bg-[#121212] rounded-lg border border-[#2A2A2A]">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold mr-3">
                      FA
                    </div>
                    <div>
                      <p className="text-sm font-medium">Farhan Ahmed</p>
                      <p className="text-xs text-gray-400">ML Engineer • KUET</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">TensorFlow</span>
                    <span className="px-2 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs rounded">Data Science</span>
                  </div>
                </div>
              </div>

              <div
                className="text-center p-3 bg-[#14B8A6]/10 rounded-lg border border-[#14B8A6]/30">
                <p className="text-sm text-[#14B8A6]">
                  <Sparkles className="inline-block h-4 w-4 mr-1" />
                  <span className="font-medium">98% Compatibility Match</span> - This team has complementary skills for
                  your AI-powered fintech project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

