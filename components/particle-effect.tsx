"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import useMobileDetect from "@/hooks/use-mobile"

interface ParticleEffectProps {
  type: "stars" | "bubbles" | "fireflies" | "dust" | "magic"
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  life?: number
  maxLife?: number
  hue?: number
  brightness?: number
}

export default function ParticleEffect({ type = "stars" }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isMobile = useMobileDetect()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Track mouse movement for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMouseMoving(true)

      // Reset mouse moving state after 100ms of inactivity
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => setIsMouseMoving(false), 100)
    }

    let mouseTimeout: NodeJS.Timeout
    window.addEventListener("mousemove", handleMouseMove)

    // Create particles based on type
    let particleCount = isMobile ? 50 : 100

    // Adjust particle count based on type
    switch (type) {
      case "stars":
        particleCount = isMobile ? 50 : 100
        break
      case "bubbles":
        particleCount = isMobile ? 30 : 60
        break
      case "fireflies":
        particleCount = isMobile ? 20 : 40
        break
      case "dust":
        particleCount = isMobile ? 40 : 80
        break
      case "magic":
        particleCount = isMobile ? 30 : 60
        break
    }

    const particles: Particle[] = []

    // Generate color palette based on type
    let colors: string[] = []

    switch (type) {
      case "stars":
        colors = ["#0ea5e9", "#3b82f6", "#8b5cf6", "#f59e0b", "#f97316"]
        break
      case "bubbles":
        colors = ["#0ea5e9", "#06b6d4", "#0891b2", "#0e7490", "#155e75"]
        break
      case "fireflies":
        colors = ["#f59e0b", "#f97316", "#fbbf24", "#facc15", "#eab308"]
        break
      case "dust":
        colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#6d28d9"]
        break
      case "magic":
        colors = ["#ec4899", "#f472b6", "#f9a8d4", "#e879f9", "#d946ef"]
        break
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
      }

      // Add specific properties based on type
      if (type === "fireflies") {
        particle.life = 0
        particle.maxLife = 100 + Math.random() * 100
        particle.size = Math.random() * 2 + 2
        particle.brightness = 0.5 + Math.random() * 0.5
      }

      if (type === "magic") {
        particle.hue = Math.random() * 360
        particle.size = Math.random() * 4 + 2
      }

      particles.push(particle)
    }

    // Animation loop with optimized frame rate
    let lastTime = 0
    const fps = isMobile ? 30 : 60
    const fpsInterval = 1000 / fps

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastTime

      if (elapsed > fpsInterval) {
        lastTime = timestamp - (elapsed % fpsInterval)

        // Clear canvas with fade effect based on type
        ctx.fillStyle =
          type === "stars" || type === "fireflies"
            ? "rgba(15, 23, 42, 0.1)" // Slower fade for stars and fireflies
            : "rgba(15, 23, 42, 0.2)" // Faster fade for other effects
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach((particle, index) => {
          // Draw particle with enhanced visual effects
          ctx.save()
          ctx.globalAlpha = particle.opacity

          if (type === "magic") {
            // Enhanced rainbow effect for magic particles
            ctx.fillStyle = `hsl(${particle.hue || 0}, 100%, 75%)`
            ctx.shadowColor = `hsl(${particle.hue || 0}, 100%, 75%)`
            ctx.shadowBlur = 10
          } else {
            ctx.fillStyle = particle.color
            ctx.shadowColor = particle.color
            ctx.shadowBlur = 5
          }

          if (type === "stars") {
            // Enhanced star shape with better glow
            const spikes = 5
            const outerRadius = particle.size * 1.2
            const innerRadius = particle.size * 0.5

            ctx.shadowBlur = 15

            ctx.beginPath()
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius
              const angle = Math.PI * 2 * (i / (spikes * 2))
              const x = particle.x + radius * Math.cos(angle)
              const y = particle.y + radius * Math.sin(angle)

              if (i === 0) {
                ctx.moveTo(x, y)
              } else {
                ctx.lineTo(x, y)
              }
            }

            ctx.closePath()
            ctx.fill()

            // Add extra glow for stars
            ctx.globalAlpha = particle.opacity * 0.4
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
          } else if (type === "bubbles") {
            // Enhanced bubble shape with better gradient
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              particle.size * 2.5,
            )
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(0.6, particle.color.replace(")", ", 0.6)").replace("rgb", "rgba"))
            gradient.addColorStop(1, "transparent")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2)
            ctx.fill()

            // Add highlight to bubble
            ctx.beginPath()
            ctx.arc(
              particle.x - particle.size * 0.5,
              particle.y - particle.size * 0.5,
              particle.size * 0.5,
              0,
              Math.PI * 2,
            )
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
            ctx.fill()
          } else if (type === "fireflies") {
            // Enhanced firefly glow effect
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              particle.size * 3,
            )
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(0.4, particle.color.replace(")", ", 0.6)").replace("rgb", "rgba"))
            gradient.addColorStop(1, "transparent")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
            ctx.fill()

            // Pulsating effect with smoother animation
            particle.life = (particle.life || 0) + 1
            if (particle.life > (particle.maxLife || 100)) {
              particle.life = 0
              particle.x = Math.random() * canvas.width
              particle.y = Math.random() * canvas.height
            }

            const lifeRatio = (particle.life || 0) / (particle.maxLife || 100)
            particle.opacity = Math.sin(lifeRatio * Math.PI) * (particle.brightness || 0.7)
          } else {
            // Enhanced default circular particle
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fill()

            // Add subtle glow
            ctx.globalAlpha = particle.opacity * 0.4
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
          }

          ctx.restore()

          // Update position
          particle.x += particle.speedX
          particle.y += particle.speedY

          // Interactive effects based on mouse position
          if (isMouseMoving && type !== "stars") {
            const dx = mousePosition.x - particle.x
            const dy = mousePosition.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              // Repel particles from mouse
              const angle = Math.atan2(dy, dx)
              const force = (100 - distance) / 1000
              particle.speedX -= Math.cos(angle) * force
              particle.speedY -= Math.sin(angle) * force

              // Add some randomness to prevent particles from getting stuck
              particle.speedX += (Math.random() - 0.5) * 0.01
              particle.speedY += (Math.random() - 0.5) * 0.01
            }
          }

          // Magic particles color cycling
          if (type === "magic" && particle.hue !== undefined) {
            particle.hue = (particle.hue + 0.5) % 360
          }

          // Bounce off edges with damping
          if (particle.x > canvas.width || particle.x < 0) {
            particle.speedX = -particle.speedX * 0.9

            if (particle.x > canvas.width) particle.x = canvas.width
            if (particle.x < 0) particle.x = 0
          }

          if (particle.y > canvas.height || particle.y < 0) {
            particle.speedY = -particle.speedY * 0.9

            if (particle.y > canvas.height) particle.y = canvas.height
            if (particle.y < 0) particle.y = 0
          }

          // Apply friction to slow particles gradually
          particle.speedX *= 0.99
          particle.speedY *= 0.99

          // Add slight gravity for dust particles
          if (type === "dust") {
            particle.speedY += 0.01
          }

          // Random movement for fireflies
          if (type === "fireflies" && Math.random() < 0.05) {
            particle.speedX = (Math.random() - 0.5) * 0.5
            particle.speedY = (Math.random() - 0.5) * 0.5
          }
        })
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
      clearTimeout(mouseTimeout)
    }
  }, [type, theme, isMobile, isMouseMoving, mousePosition])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />
}
