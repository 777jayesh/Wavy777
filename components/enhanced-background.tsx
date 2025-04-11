"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import useMobileDetect from "@/hooks/use-mobile"

export default function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])
  const nebulasRef = useRef<any[]>([])
  const starsRef = useRef<any[]>([])
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas dimensions with high DPI support
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Detect if running on a low-end device
    const isLowEndDevice = () => {
      const memory = (navigator as any).deviceMemory
      return memory && memory <= 4
    }

    // Adjust particle counts based on device capability
    const particleMultiplier = isLowEndDevice() ? 0.5 : 1

    // Create particles
    const particleCount = isMobile ? Math.floor(100 * particleMultiplier) : Math.floor(200 * particleMultiplier)

    particlesRef.current = []

    // Create colorful particles
    const colorPalettes = [
      // Blue/Purple theme
      ["#4f46e5", "#3b82f6", "#0ea5e9", "#8b5cf6", "#a78bfa"],
      // Pink/Purple theme
      ["#ec4899", "#f472b6", "#f9a8d4", "#e879f9", "#d946ef"],
      // Cyan/Blue theme
      ["#06b6d4", "#0ea5e9", "#3b82f6", "#0891b2", "#0284c7"],
      // Gold/Orange theme
      ["#f59e0b", "#fbbf24", "#f97316", "#fb923c", "#fdba74"],
    ]

    // Select a random color palette
    const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]

    for (let i = 0; i < particleCount; i++) {
      const color = selectedPalette[Math.floor(Math.random() * selectedPalette.length)]
      const size = Math.random() * 3 + 1
      const opacity = 0.3 + Math.random() * 0.7

      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color,
        opacity,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        sinOffset: Math.random() * Math.PI * 2,
        sinSpeed: 0.01 + Math.random() * 0.02,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        glow: 5 + Math.random() * 10,
      })
    }

    // Create nebulas
    const nebulaCount = isMobile ? 3 : 5
    nebulasRef.current = []

    for (let i = 0; i < nebulaCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = (isMobile ? 150 : 300) + Math.random() * 200
      const color = selectedPalette[Math.floor(Math.random() * selectedPalette.length)]

      nebulasRef.current.push({
        x,
        y,
        radius,
        color,
        opacity: 0.05 + Math.random() * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0001,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.002,
      })
    }

    // Create stars
    const starCount = isMobile ? 150 : 300
    starsRef.current = []

    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 2 + 0.5
      const brightness = 0.6 + Math.random() * 0.4

      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color: `rgba(255, 255, 255, ${brightness})`,
        twinkleSpeed: 0.03 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        glow: 3 + Math.random() * 5,
      })
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
      setIsMouseMoving(true)

      // Reset mouse moving state after 100ms of inactivity
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => setIsMouseMoving(false), 100)
    }

    let mouseTimeout: NodeJS.Timeout
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop with optimized frame rate
    const animate = (timestamp: number) => {
      // Limit to 30fps for better performance
      const elapsed = timestamp - lastFrameTimeRef.current
      if (elapsed < 33) {
        // ~30fps
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // Clear canvas with a deep space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#050714")
      gradient.addColorStop(1, "#0a0a2a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulas
      nebulasRef.current.forEach((nebula) => {
        // Update nebula rotation and pulsing
        nebula.rotation += nebula.rotationSpeed
        nebula.pulsePhase += nebula.pulseSpeed
        const pulseScale = 1 + Math.sin(nebula.pulsePhase) * 0.05

        ctx.save()
        ctx.translate(nebula.x, nebula.y)
        ctx.rotate(nebula.rotation)
        ctx.scale(pulseScale, pulseScale)

        // Create a more complex nebula shape
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.radius)
        const colorWithOpacity = nebula.color.replace("rgb", "rgba").replace(")", `, ${nebula.opacity})`)
        gradient.addColorStop(0, colorWithOpacity)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()

        // Draw an elliptical shape
        const aspectRatio = 0.7 + Math.random() * 0.6
        ctx.ellipse(0, 0, nebula.radius, nebula.radius * aspectRatio, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Update position with sinusoidal movement
        particle.sinOffset += particle.sinSpeed
        particle.pulsePhase += particle.pulseSpeed

        particle.x += particle.speedX + Math.sin(particle.sinOffset) * 0.2
        particle.y += particle.speedY + Math.cos(particle.sinOffset) * 0.2

        // Pulse size and opacity
        const pulseFactor = 0.5 + Math.sin(particle.pulsePhase) * 0.5
        const currentSize = particle.size * (0.8 + pulseFactor * 0.4)
        const currentOpacity = particle.opacity * pulseFactor

        // Interactive behavior with mouse
        if (isMouseMoving) {
          const dx = mousePosition.x - particle.x
          const dy = mousePosition.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Repel particles from mouse
            const angle = Math.atan2(dy, dx)
            const force = (150 - distance) / 1500
            particle.speedX -= Math.cos(angle) * force
            particle.speedY -= Math.sin(angle) * force
          }
        }

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        // Apply friction
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = currentOpacity
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.glow * pulseFactor

        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update twinkle
        star.twinklePhase += star.twinkleSpeed
        const twinkleFactor = 0.5 + Math.sin(star.twinklePhase) * 0.5

        // Draw star with glow
        ctx.save()
        ctx.globalAlpha = twinkleFactor
        ctx.shadowColor = star.color
        ctx.shadowBlur = star.glow * twinkleFactor

        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * twinkleFactor, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimeout)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 opacity-70"></div>

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        animate={{
          background: [
            "radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.3), transparent 70%)",
            "radial-gradient(circle at 70% 60%, rgba(79, 70, 229, 0.3), transparent 70%)",
            "radial-gradient(circle at 40% 80%, rgba(79, 70, 229, 0.3), transparent 70%)",
            "radial-gradient(circle at 60% 30%, rgba(79, 70, 229, 0.3), transparent 70%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </div>
  )
}
