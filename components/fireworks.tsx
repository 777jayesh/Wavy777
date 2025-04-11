"use client"

import { useEffect, useRef } from "react"
import useMobileDetect from "@/hooks/use-mobile"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  life: number
  opacity: number
  hue?: number
  saturation?: number
  lightness?: number
  glow?: number
}

interface Firework {
  x: number
  y: number
  targetY: number
  speed: number
  particles: Particle[]
  color: string
  exploded: boolean
  size: number
  hue: number
  saturation: number
  lightness: number
  trailParticles: Particle[]
}

interface FireworksProps {
  intensity?: "low" | "medium" | "high"
}

export default function Fireworks({ intensity = "medium" }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Enable blur for smoother effects
    if (typeof ctx.filter !== "undefined") {
      ctx.filter = "blur(0.5px)"
    }

    // Set canvas dimensions with high DPI support for 4K
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
    let particleMultiplier = 1
    let fireworkFrequency = 300 // ms between fireworks
    let initialFireworks = 8
    let maxFireworks = 20

    switch (intensity) {
      case "low":
        particleMultiplier = 0.7
        fireworkFrequency = 800
        initialFireworks = 3
        maxFireworks = 8
        break
      case "medium":
        particleMultiplier = 1
        fireworkFrequency = 500
        initialFireworks = 5
        maxFireworks = 12
        break
      case "high":
        particleMultiplier = 1.5
        fireworkFrequency = 200
        initialFireworks = 8
        maxFireworks = 20
        break
    }

    // Enhanced realistic fire color palette
    const createFireworkColor = () => {
      const colorType = Math.random()

      let hue, saturation, lightness

      if (colorType < 0.3) {
        // Deep red/orange fire core
        hue = 10 + Math.random() * 20 // 10-30
        saturation = 90 + Math.random() * 10 // 90-100%
        lightness = 50 + Math.random() * 15 // 50-65%
      } else if (colorType < 0.6) {
        // Bright yellow/orange flames
        hue = 30 + Math.random() * 15 // 30-45
        saturation = 90 + Math.random() * 10 // 90-100%
        lightness = 55 + Math.random() * 15 // 55-70%
      } else if (colorType < 0.8) {
        // Blue flame tips
        hue = 210 + Math.random() * 30 // 210-240
        saturation = 90 + Math.random() * 10 // 90-100%
        lightness = 55 + Math.random() * 15 // 55-70%
      } else {
        // Sparks (white/yellow)
        hue = 45 + Math.random() * 15 // 45-60
        saturation = 80 + Math.random() * 20 // 80-100%
        lightness = 65 + Math.random() * 15 // 65-80%
      }

      return { hue, saturation, lightness }
    }

    // Fireworks array
    const fireworks: Firework[] = []

    // Create a new firework
    const createFirework = () => {
      // Don't exceed max fireworks
      if (fireworks.length >= maxFireworks) return

      const x = Math.random() * canvas.width
      const y = canvas.height
      const targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.5)
      const speed = 2 + Math.random() * 3

      // Get vibrant color
      const { hue, saturation, lightness } = createFireworkColor()
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`

      const size = 2 + Math.random() * 2

      fireworks.push({
        x,
        y,
        targetY,
        speed,
        particles: [],
        trailParticles: [], // Add trail particles
        color,
        exploded: false,
        size,
        hue,
        saturation,
        lightness,
      })
    }

    // Create particles when firework explodes
    const explodeFirework = (firework: Firework) => {
      const baseParticleCount = isMobile ? 100 : 200
      const particleCount = Math.floor(baseParticleCount * particleMultiplier)

      // Create explosion patterns
      const pattern = Math.floor(Math.random() * 6)

      for (let i = 0; i < particleCount; i++) {
        let angle, speed, size

        // Different explosion patterns
        switch (pattern) {
          case 0: // Circle
            angle = Math.random() * Math.PI * 2
            speed = Math.random() * 5 + 1
            break
          case 1: // Heart shape
            const t = Math.random() * Math.PI * 2
            const r = Math.random() * 0.8 + 0.2
            // Heart curve parametric equation
            const x = r * 16 * Math.pow(Math.sin(t), 3)
            const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
            angle = Math.atan2(y, x)
            speed = Math.random() * 3 + 1
            break
          case 2: // Star burst
            angle = (i / particleCount) * Math.PI * 2
            speed = Math.random() * 5 + 2
            break
          case 3: // Double ring
            angle = Math.random() * Math.PI * 2
            speed = (Math.random() > 0.5 ? 2 : 4) + Math.random() * 2
            break
          case 4: // Spiral
            angle = (i / particleCount) * Math.PI * 20
            speed = 1 + (i / particleCount) * 5
            break
          case 5: // Chrysanthemum
            angle = Math.random() * Math.PI * 2
            const layer = Math.floor(Math.random() * 3)
            speed = 2 + layer * 2 + Math.random() * 2
            break
          default:
            angle = Math.random() * Math.PI * 2
            speed = Math.random() * 5 + 1
        }

        // Varied sizes for more natural look
        size = Math.random() * 3 + 1

        // Color variation based on the firework's base color
        const hueVariation = firework.hue + (Math.random() * 20 - 10) // ±10 degrees
        const saturationVariation = Math.max(50, firework.saturation - Math.random() * 30) // Slightly less saturated
        const lightnessVariation = Math.min(80, firework.lightness + Math.random() * 20) // Slightly brighter

        // Glow effect intensity
        const glow = 0.5 + Math.random() * 0.5

        // Create particle with velocity based on pattern
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          size,
          color: `hsl(${hueVariation}, ${saturationVariation}%, ${lightnessVariation}%)`,
          speedX: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4), // Slight speed variation
          speedY: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4),
          life: 100 + Math.random() * 50, // Varied life for staggered fade
          opacity: 1,
          hue: hueVariation,
          saturation: saturationVariation,
          lightness: lightnessVariation,
          glow,
        })
      }

      firework.exploded = true
    }

    // Animation loop with smoother timing using requestAnimationFrame
    let lastFireworkTime = 0
    let lastFrameTime = 0

    const animate = (timestamp: number) => {
      // Calculate delta time for smoother animations
      const deltaTime = timestamp - lastFrameTime
      lastFrameTime = timestamp

      // Clear canvas with fade effect for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)" // Slower fade for better trails
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create new fireworks at intervals based on intensity
      if (timestamp - lastFireworkTime > fireworkFrequency) {
        createFirework()
        lastFireworkTime = timestamp
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i]

        if (!firework.exploded) {
          // Move firework up with smoother motion
          firework.y -= firework.speed * (deltaTime / 16)

          // Add trail particles
          if (Math.random() < 0.3) {
            firework.trailParticles.push({
              x: firework.x + (Math.random() - 0.5) * 2,
              y: firework.y + Math.random() * 5,
              size: Math.random() * firework.size,
              color: firework.color,
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

            // Draw trail particle
            ctx.save()
            ctx.globalAlpha = particle.opacity
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

          // Draw firework with glow effect
          ctx.save()

          // Add glow
          ctx.shadowColor = firework.color
          ctx.shadowBlur = 15

          ctx.beginPath()
          ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2)
          ctx.fillStyle = firework.color
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

            // Apply gravity with smoother motion
            particle.speedY += 0.03 * (deltaTime / 16)

            // Update position with smoother motion
            particle.x += particle.speedX * (deltaTime / 16)
            particle.y += particle.speedY * (deltaTime / 16)

            // Update life and opacity
            particle.life -= 1 * (deltaTime / 16)

            // Non-linear opacity fade for more realistic effect
            particle.opacity = (particle.life / 100) * (particle.life / 100)

            // Draw particle with glow effect
            ctx.save()

            // Add glow based on particle's glow value
            if (particle.glow) {
              ctx.shadowColor = particle.color
              ctx.shadowBlur = 8 * (particle.glow || 1)
            }

            ctx.globalAlpha = particle.opacity
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()

            // Add motion blur effect for smoother trails
            if (particle.life > 50) {
              const trailLength = Math.min(8, particle.speedX * particle.speedX + particle.speedY * particle.speedY)
              const trailX = particle.x - particle.speedX * trailLength * 0.3
              const trailY = particle.y - particle.speedY * trailLength * 0.3

              const gradient = ctx.createLinearGradient(particle.x, particle.y, trailX, trailY)
              gradient.addColorStop(0, particle.color)
              gradient.addColorStop(1, "transparent")

              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(trailX, trailY)
              ctx.strokeStyle = gradient
              ctx.lineWidth = particle.size * 0.8
              ctx.stroke()
            }

            ctx.restore()

            // Remove dead particles
            if (particle.life <= 0) {
              firework.particles.splice(j, 1)
            }
          }

          // Remove firework if all particles are gone
          if (firework.particles.length === 0) {
            fireworks.splice(i, 1)
          }
        }
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Create initial fireworks
    for (let i = 0; i < initialFireworks; i++) {
      createFirework()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isMobile, intensity])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30" />
}
