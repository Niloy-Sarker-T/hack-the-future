import { Calendar, Users, Award, Zap, Shield, Globe } from "lucide-react"

export default function Benefits() {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-[#121212]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Benefits</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">A comprehensive solution for all hackathon stakeholders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Organizers */}
          <div
            className="p-8 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div
              className="w-14 h-14 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-6">
              <Calendar className="h-7 w-7 text-[#14B8A6]" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Organizers</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Event Management</span>
                  <p className="text-gray-400 text-sm mt-1">
                    Streamlined tools to create, manage, and track hackathon events
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Sponsor Tracking</span>
                  <p className="text-gray-400 text-sm mt-1">Manage sponsorships and track contributions efficiently</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Judging Tools</span>
                  <p className="text-gray-400 text-sm mt-1">
                    Comprehensive scoring system for fair and transparent evaluation
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* For Participants */}
          <div
            className="p-8 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div
              className="w-14 h-14 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-[#14B8A6]" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Participants</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Team Formation</span>
                  <p className="text-gray-400 text-sm mt-1">
                    AI-powered suggestions for forming balanced, skilled teams
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Submission Tools</span>
                  <p className="text-gray-400 text-sm mt-1">
                    Easy project submission with version control and collaboration
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Collaboration Features</span>
                  <p className="text-gray-400 text-sm mt-1">Real-time chat and file sharing for seamless teamwork</p>
                </div>
              </li>
            </ul>
          </div>

          {/* For Sponsors/Judges */}
          <div
            className="p-8 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div
              className="w-14 h-14 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-6">
              <Award className="h-7 w-7 text-[#14B8A6]" />
            </div>
            <h3 className="text-xl font-bold mb-4">For Sponsors & Judges</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Clear Metrics</span>
                  <p className="text-gray-400 text-sm mt-1">Detailed analytics on participation and engagement</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Easy Evaluation</span>
                  <p className="text-gray-400 text-sm mt-1">Streamlined judging interface with customizable criteria</p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 mt-1">
                  <div
                    className="w-5 h-5 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-white">Talent Discovery</span>
                  <p className="text-gray-400 text-sm mt-1">Identify promising innovators and potential recruits</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6">
            <div
              className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#14B8A6]" />
            </div>
            <h4 className="font-medium text-white mb-2">Fast & Efficient</h4>
            <p className="text-gray-400 text-sm">Streamlined processes from registration to submission</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div
              className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-[#14B8A6]" />
            </div>
            <h4 className="font-medium text-white mb-2">Secure & Reliable</h4>
            <p className="text-gray-400 text-sm">Enterprise-grade security for your data and submissions</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div
              className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-[#14B8A6]" />
            </div>
            <h4 className="font-medium text-white mb-2">Nationwide Network</h4>
            <p className="text-gray-400 text-sm">Connect with innovators across Bangladesh</p>
          </div>
        </div>
      </div>
    </section>
  );
}

