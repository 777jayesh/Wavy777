"use client"

import { useEffect, useRef } from "react"
import useMobileDetect from "@/hooks/use-mobile"

interface OptimizedFireworksProps {
  intensity?: "low" | "medium" | "high"
}

export default function OptimizedFireworks({ intensity = "medium" }: OptimizedFireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const animationRef = useRef<number>()
  const fireworksRef = useRef<any[]>([])
  const lastTimeRef = useRef<number>(0)
  const lastFireworkTimeRef = useRef<number>(0)

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

    // Configure based on intensity
    let particleMultiplier = 0.5
    let fireworkFrequency = 800 // ms between fireworks
    let initialFireworks = 3
    let maxFireworks = 8

    switch (intensity) {
      case "low":
        particleMultiplier = 0.3
        fireworkFrequency = 1200
        initialFireworks = 2
        maxFireworks = 5
        break
      case "medium":
        particleMultiplier = 0.5
        fireworkFrequency = 800
        initialFireworks = 3
        maxFireworks = 8
        break
      case "high":
        particleMultiplier = 0.8
        fireworkFrequency = 500
        initialFireworks = 5
        maxFireworks = 12
        break
    }

    // Enhanced color palettes for more vibrant fireworks
    const colorPalettes = [
      // Blue theme
      ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#0891b2"],
      // Purple theme
      ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#6d28d9"],
      // Pink/Red theme
      ["#ec4899", "#f472b6", "#f9a8d4", "#e879f9", "#d946ef"],
      // Gold theme
      ["#f59e0b", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
      // Green theme
      ["#10b981", "#34d399", "#6ee7b7", "#059669", "#047857"],
    ]

    // Create a new firework with enhanced properties
    const createFirework = () => {
      if (fireworksRef.current.length >= maxFireworks) return

      const x = Math.random() * canvas.width
      const y = canvas.height
      const targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.5)
      const speed = 2 + Math.random() * 3

      // Select a random color palette
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
      const baseColor = palette[Math.floor(Math.random() * palette.length)]

      // Convert hex to HSL for easier manipulation
      const r = Number.parseInt(baseColor.slice(1, 3), 16)
      const g = Number.parseInt(baseColor.slice(3, 5), 16)
      const b = Number.parseInt(baseColor.slice(5, 7), 16)

      // Simple RGB to HSL conversion (approximate)
      const max = Math.max(r, g, b) / 255
      const min = Math.min(r, g, b) / 255
      const l = (max + min) / 2

      let h = 0
      let s = 0

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        if (max === r / 255) h = (g / 255 - b / 255) / d + (g < b ? 6 : 0)
        else if (max === g / 255) h = (b / 255 - r / 255) / d + 2
        else if (max === b / 255) h = (r / 255 - g / 255) / d + 4

        h /= 6
      }

      const hue = Math.round(h * 360)
      const saturation = Math.round(s * 100)
      const lightness = Math.round(l * 100)

      fireworksRef.current.push({
        x,
        y,
        targetY,
        speed,
        particles: [],
        trailParticles: [],
        hue,
        saturation,
        lightness,
        palette,
        exploded: false,
        size: 2 + Math.random() * 2,
      })
    }

    // Create particles when firework explodes with enhanced visual effects
    const explodeFirework = (firework: any) => {
      const baseParticleCount = isMobile ? 50 : 100
      const particleCount = Math.floor(baseParticleCount * particleMultiplier)
      const pattern = Math.floor(Math.random() * 6) // More pattern varieties

      for (let i = 0; i < particleCount; i++) {
        let angle, speed, size

        // Different explosion patterns for more variety
        switch (pattern) {
          case 0: // Circle
            angle = Math.random() * Math.PI * 2
            speed = Math.random() * 3 + 1
            break
          case 1: // Heart shape
            const t = Math.random() * Math.PI * 2
            const r = Math.random() * 0.8 + 0.2
            // Heart curve parametric equation
            const x = r * 16 * Math.pow(Math.sin(t), 3)
            const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
            angle = Math.atan2(y, x)
            speed = Math.random() * 2 + 1
            break
          case 2: // Star burst
            angle = (i / particleCount) * Math.PI * 2
            speed = Math.random() * 3 + 1
            break
          case 3: // Double ring
            angle = Math.random() * Math.PI * 2
            speed = (Math.random() > 0.5 ? 1.5 : 3) + Math.random()
            break
          case 4: // Spiral
            angle = (i / particleCount) * Math.PI * 20
            speed = 1 + (i / particleCount) * 3
            break
          case 5: // Chrysanthemum
            angle = Math.random() * Math.PI * 2
            const layer = Math.floor(Math.random() * 3)
            speed = 1.5 + layer + Math.random()
            break
          default:
            angle = Math.random() * Math.PI * 2
            speed = Math.random() * 3 + 1
        }

        // Color variation based on the firework's palette
        const colorIndex = Math.floor(Math.random() * firework.palette.length)
        const particleColor = firework.palette[colorIndex]

        // Varied sizes for more natural look
        size = Math.random() * 2 + 1

        firework.particles.push({
          x: firework.x,
          y: firework.y,
          size,
          color: particleColor,
          speedX: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
          speedY: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4),
          life: 80 + Math.random() * 40,
          opacity: 1,
          hue: firework.hue + (Math.random() * 20 - 10),
          saturation: firework.saturation,
          lightness: firework.lightness + Math.random() * 20,
        })
      }

      firework.exploded = true
    }

    // Animation loop with optimized frame rate
    const animate = (timestamp: number) => {
      // Calculate delta time for smoother animations
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      // Limit to 30fps for better performance
      if (deltaTime < 33) {
        // ~30fps
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas with fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create new fireworks at intervals based on intensity
      if (timestamp - lastFireworkTimeRef.current > fireworkFrequency) {
        createFirework()
        lastFireworkTimeRef.current = timestamp
      }

      // Update and draw fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const firework = fireworksRef.current[i]

        if (!firework.exploded) {
          // Move firework up
          firework.y -= firework.speed * (deltaTime / 16)

          // Add trail particles (reduced for performance)
          if (Math.random() < 0.2) {
            firework.trailParticles.push({
              x: firework.x + (Math.random() - 0.5) * 2,
              y: firework.y + Math.random() * 5,
              size: Math.random() * firework.size,
              color: `hsl(${firework.hue}, ${firework.saturation}%, ${firework.lightness}%)`,
              speedX: (Math.random() - 0.5) * 0.2,
              speedY: Math.random() * 0.5,
              life: 20 + Math.random() * 20,
              opacity: 0.7,
            })
          }

          // Update and draw trail particles
          for (let j = firework.trailParticles.length - 1; j >= 0; j--) {
            const particle = firework.trailParticles[j]
            particle.y += particle.speedY
            particle.x += particle.speedX
            particle.life -= 1
            particle.opacity = particle.life / 40

            // Draw trail particle with glow
            ctx.save()
            ctx.globalAlpha = particle.opacity
            ctx.shadowColor = particle.color
            ctx.shadowBlur = 5
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
            ctx.restore()

            // Remove dead trail particles
            if (particle.life <= 0) {
              firework.trailParticles.splice(j, 1)
            }
          }

          // Draw firework with enhanced glow
          ctx.save()
          ctx.shadowColor = `hsl(${firework.hue}, ${firework.saturation}%, ${firework.lightness}%)`
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${firework.hue}, ${firework.saturation}%, ${firework.lightness}%)`
          ctx.fill()
          ctx.restore()

          // Check if firework reached target height
          if (firework.y <= firework.targetY) {
            explodeFirework(firework)
          }
        } else {
          // Update and draw particles
          for (let j = firework.particles.length - 1; j >= 0; j--) {
            const particle = firework.particles[j]

            // Apply gravity
            particle.speedY += 0.03 * (deltaTime / 16)

            // Update position
            particle.x += particle.speedX * (deltaTime / 16)
            particle.y += particle.speedY * (deltaTime / 16)

            // Update life and opacity
            particle.life -= 1 * (deltaTime / 16)
            particle.opacity = (particle.life / 80) * (particle.life / 80)

            // Draw particle with enhanced glow
            if (particle.opacity > 0) {
              ctx.save()
              ctx.globalAlpha = particle.opacity
              ctx.shadowColor = particle.color
              ctx.shadowBlur = 8
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
              ctx.fillStyle = particle.color
              ctx.fill()
              ctx.restore()
            }

            // Remove dead particles
            if (particle.life <= 0) {
              firework.particles.splice(j, 1)
            }
          }

          // Remove firework if all particles are gone
          if (firework.particles.length === 0) {
            fireworksRef.current.splice(i, 1)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Create initial fireworks
    for (let i = 0; i < initialFireworks; i++) {
      createFirework()
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
      fireworksRef.current = []
    }
  }, [isMobile, intensity])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30" />
}
