"use client"

import { useEffect, useRef } from "react"
import useMobileDetect from "@/hooks/use-mobile"

interface GlisteningStarsProps {
  density?: "low" | "medium" | "high"
  speed?: "slow" | "medium" | "fast"
}

export default function GlisteningStars({ density = "medium", speed = "medium" }: GlisteningStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const starsRef = useRef<any[]>([])
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

    // Configure based on density
    let starCount = 150
    switch (density) {
      case "low":
        starCount = isMobile ? 100 : 150
        break
      case "medium":
        starCount = isMobile ? 200 : 300
        break
      case "high":
        starCount = isMobile ? 300 : 500
        break
    }

    // Configure based on speed
    let speedMultiplier = 1
    switch (speed) {
      case "slow":
        speedMultiplier = 0.7
        break
      case "medium":
        speedMultiplier = 1
        break
      case "fast":
        speedMultiplier = 1.5
        break
    }

    // Create falling stars
    starsRef.current = []
    for (let i = 0; i < starCount; i++) {
      // Varied sizes for more natural look
      const size = Math.random() * 3 + 0.5

      // Create a more varied color palette for stars
      let color
      const colorType = Math.random()
      if (colorType < 0.6) {
        // White to blue-white stars (most common)
        const blueHint = Math.floor(Math.random() * 30)
        color = `rgba(${235 + blueHint}, ${235 + blueHint}, 255, 0.9)`
      } else if (colorType < 0.8) {
        // Yellow-orange stars
        color = `rgba(255, ${180 + Math.floor(Math.random() * 70)}, ${100 + Math.floor(Math.random() * 70)}, 0.9)`
      } else if (colorType < 0.95) {
        // Red stars
        color = `rgba(255, ${100 + Math.floor(Math.random() * 70)}, ${100 + Math.floor(Math.random() * 50)}, 0.9)`
      } else {
        // Blue stars
        color = `rgba(${100 + Math.floor(Math.random() * 70)}, ${150 + Math.floor(Math.random() * 70)}, 255, 0.9)`
      }

      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color,
        speed: (0.1 + Math.random() * 0.5) * speedMultiplier,
        opacity: 0.7 + Math.random() * 0.3,
        twinkleSpeed: (0.02 + Math.random() * 0.03) * speedMultiplier,
        twinklePhase: Math.random() * Math.PI * 2,
        glow: 5 + Math.random() * 10,
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

      // Clear canvas with fade effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Update star position - falling effect
        star.y += star.speed

        // Wrap around when star reaches bottom
        if (star.y > canvas.height) {
          star.y = -10
          star.x = Math.random() * canvas.width
        }

        // Update twinkle
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.7 + Math.sin(star.twinklePhase) * 0.3

        // Draw star with glow effect
        ctx.save()
        ctx.globalAlpha = star.opacity * twinkle

        // Add glow
        ctx.shadowColor = star.color
        ctx.shadowBlur = star.glow * twinkle

        // Draw the star
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2)
        ctx.fill()

        // For larger stars, add a cross-shaped highlight
        if (star.size > 1.8) {
          const glowSize = star.size * 2 * twinkle
          ctx.strokeStyle = star.color
          ctx.lineWidth = 0.5 * twinkle
          ctx.beginPath()
          ctx.moveTo(star.x - glowSize, star.y)
          ctx.lineTo(star.x + glowSize, star.y)
          ctx.moveTo(star.x, star.y - glowSize)
          ctx.lineTo(star.x, star.y + glowSize)
          ctx.stroke()
        }

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
    }
  }, [density, isMobile, speed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{
        mixBlendMode: "screen",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    />
  )
}
