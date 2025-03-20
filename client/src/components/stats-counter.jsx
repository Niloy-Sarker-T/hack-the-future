"use client"

import { useEffect, useState } from "react"
import { Code, Users, Trophy, Calendar } from "lucide-react"

export default function StatsCounter() {
  const [counts, setCounts] = useState({
    events: 0,
    users: 0,
    projects: 0,
    universities: 0,
  })

  const targets = {
    events: 42,
    users: 5280,
    projects: 1350,
    universities: 78,
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        events: prev.events < targets.events ? prev.events + 1 : targets.events,
        users: prev.users < targets.users ? prev.users + 50 : targets.users,
        projects: prev.projects < targets.projects ? prev.projects + 15 : targets.projects,
        universities: prev.universities < targets.universities ? prev.universities + 1 : targets.universities,
      }))
    }, 50)

    return () => clearInterval(interval);
  }, [])

  return (
    <section className="py-12 bg-[#121212]/50 border-y border-[#2A2A2A]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div
            className="p-6 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#14B8A6]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{counts.events}</div>
            <div className="text-gray-400">Hackathons</div>
          </div>

          <div
            className="p-6 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#14B8A6]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{counts.users.toLocaleString()}</div>
            <div className="text-gray-400">Participants</div>
          </div>

          <div
            className="p-6 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                <Code className="h-6 w-6 text-[#14B8A6]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{counts.projects.toLocaleString()}</div>
            <div className="text-gray-400">Projects</div>
          </div>

          <div
            className="p-6 rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A]">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-[#14B8A6]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{counts.universities}</div>
            <div className="text-gray-400">Universities</div>
          </div>
        </div>
      </div>
    </section>
  );
}

