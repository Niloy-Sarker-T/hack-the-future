import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

// Simplified Bangladesh map coordinates (approximation)
const mapPoints = [
  { name: "Dhaka", x: 50, y: 45, events: 15, active: true },
  { name: "Chittagong", x: 70, y: 65, events: 8, active: true },
  { name: "Sylhet", x: 75, y: 25, events: 5, active: true },
  { name: "Rajshahi", x: 20, y: 30, events: 6, active: true },
  { name: "Khulna", x: 25, y: 65, events: 4, active: true },
  { name: "Barisal", x: 45, y: 70, events: 3, active: false },
  { name: "Rangpur", x: 25, y: 10, events: 2, active: true },
  { name: "Mymensingh", x: 55, y: 25, events: 3, active: false },
]

export default function BangladeshMap() {
  const canvasRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const tooltip = tooltipRef.current

    if (!canvas || !tooltip) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return

      const { width } = container.getBoundingClientRect()
      const height = width * 0.8 // Maintain aspect ratio

      canvas.width = width
      canvas.height = height

      drawMap()
    }

    // Draw the map
    const drawMap = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between points
      ctx.beginPath()
      mapPoints.forEach((point, i) => {
        if (i < mapPoints.length - 1) {
          const nextPoint = mapPoints[i + 1]
          ctx.moveTo((point.x * canvas.width) / 100, (point.y * canvas.height) / 100)
          ctx.lineTo((nextPoint.x * canvas.width) / 100, (nextPoint.y * canvas.height) / 100)
        }
      })
      ctx.strokeStyle = "rgba(20, 184, 166, 0.2)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw points
      mapPoints.forEach((point) => {
        const x = (point.x * canvas.width) / 100
        const y = (point.y * canvas.height) / 100

        // Draw outer circle
        ctx.beginPath()
        ctx.arc(x, y, point.active ? 12 : 8, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(20, 184, 166, 0.1)"
        ctx.fill()

        // Draw inner circle
        ctx.beginPath()
        ctx.arc(x, y, point.active ? 6 : 4, 0, Math.PI * 2)
        ctx.fillStyle = point.active ? "#14B8A6" : "rgba(20, 184, 166, 0.5)"
        ctx.fill()

        // Draw pulse for active points
        if (point.active) {
          ctx.beginPath()
          ctx.arc(x, y, 12 + Math.sin(Date.now() / 500) * 5, 0, Math.PI * 2)
          ctx.strokeStyle = "rgba(20, 184, 166, 0.5)"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
    }

    // Handle mouse movement for tooltips
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let hoveredPoint = null

      for (const point of mapPoints) {
        const pointX = (point.x * canvas.width) / 100
        const pointY = (point.y * canvas.height) / 100
        const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2)

        if (distance < 15) {
          hoveredPoint = point
          break
        }
      }

      if (hoveredPoint) {
        tooltip.style.display = "block"
        tooltip.style.left = `${e.clientX}px`
        tooltip.style.top = `${e.clientY - 70}px`
        tooltip.innerHTML = `
          <div class="font-medium">${hoveredPoint.name}</div>
          <div class="text-sm">${hoveredPoint.events} Hackathons</div>
          <div class="text-xs">${hoveredPoint.active ? "Active Events" : "No Active Events"}</div>
        `
      } else {
        tooltip.style.display = "none"
      }
    }

    // Set up event listeners
    window.addEventListener("resize", setCanvasDimensions)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none"
    })

    // Initial setup
    setCanvasDimensions()

    // Animation loop
    const animate = () => {
      drawMap()
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    };
  }, [])

  return (
    <section className="py-16 md:py-24 bg-[#121212]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nationwide Coverage</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connecting innovators across Bangladesh through hackathons and tech events
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-transparent rounded-lg opacity-30 blur-xl"></div>
          <div
            className="relative p-4 md:p-8 bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#14B8A6] mr-2" />
                <h3 className="text-xl font-bold">Hackathon Locations</h3>
              </div>
              <div className="text-sm text-gray-400">
                <span className="inline-block w-3 h-3 rounded-full bg-[#14B8A6] mr-2"></span>
                Active Events
              </div>
            </div>

            <div className="relative">
              <canvas ref={canvasRef} className="w-full h-auto"></canvas>
              <div
                ref={tooltipRef}
                className="absolute hidden bg-[#1A1A1A] text-white p-2 rounded shadow-lg border border-[#2A2A2A] text-center z-10 transform -translate-x-1/2"
                style={{ pointerEvents: "none" }}></div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>8 major cities • 46+ active hackathons • 5000+ participants nationwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

