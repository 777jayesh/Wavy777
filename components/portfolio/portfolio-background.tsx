"use client"

import { useEffect, useRef } from "react"
import useMobileDetect from "@/hooks/use-mobile"

export default function PortfolioBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const particlesRef = useRef<any[]>([])
  const connectionsRef = useRef<any[]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
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

    // Create particles
    const particleCount = isMobile ? 50 : 100
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, ${0.3 + Math.random() * 0.7})`,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        connections: [],
      })
    }

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

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Find connections
        particle.connections = []
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              particle.connections.push({
                particle: otherParticle,
                distance,
              })
            }
          }
        })

        // Draw connections
        particle.connections.forEach((connection) => {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(connection.particle.x, connection.particle.y)
          const opacity = 1 - connection.distance / 150
          ctx.strokeStyle = `rgba(100, 100, 255, ${opacity * 0.5})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        background: "linear-gradient(to bottom, #050714, #0a0a2a)",
      }}
    />
  )
}
