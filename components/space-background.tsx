"use client"

import { useEffect, useRef, useState } from "react"
import useMobileDetect from "@/hooks/use-mobile"

interface SpaceBackgroundProps {
  interactive?: boolean
  starCount?: number
}

export default function SpaceBackground({ interactive = true, starCount = 400 }: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const starsRef = useRef<any[]>([])
  const nebulasRef = useRef<any[]>([])
  const galaxiesRef = useRef<any[]>([])
  const dustParticlesRef = useRef<any[]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

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

    // Detect if running on a low-end device
    const isLowEndDevice = () => {
      const memory = (navigator as any).deviceMemory
      return memory && memory <= 4
    }

    // Adjust particle counts based on device capability
    const particleMultiplier = isLowEndDevice() ? 0.5 : 1

    window.addEventListener("resize", resizeCanvas)

    // Create stars with enhanced properties
    const actualStarCount = isMobile
      ? Math.floor(starCount * 0.7 * particleMultiplier)
      : Math.floor(starCount * particleMultiplier)
    starsRef.current = []

    for (let i = 0; i < actualStarCount; i++) {
      const size = Math.random() * 3 + 0.5 // Slightly larger stars
      const brightness = 0.6 + Math.random() * 0.4 // Brighter stars

      // Create a more varied color palette for stars
      let color
      const colorType = Math.random()
      if (colorType < 0.6) {
        // White to blue-white stars (most common)
        const blueHint = Math.floor(Math.random() * 30)
        color = `rgba(${235 + blueHint}, ${235 + blueHint}, 255, ${brightness})`
      } else if (colorType < 0.8) {
        // Yellow-orange stars
        color = `rgba(255, ${180 + Math.floor(Math.random() * 70)}, ${100 + Math.floor(Math.random() * 70)}, ${brightness})`
      } else if (colorType < 0.95) {
        // Red stars
        color = `rgba(255, ${100 + Math.floor(Math.random() * 70)}, ${100 + Math.floor(Math.random() * 50)}, ${brightness})`
      } else {
        // Blue stars
        color = `rgba(${100 + Math.floor(Math.random() * 70)}, ${150 + Math.floor(Math.random() * 70)}, 255, ${brightness})`
      }

      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        originalSize: size,
        color,
        blinkSpeed: 0.01 + Math.random() * 0.02, // Faster twinkling
        blinkDirection: Math.random() > 0.5 ? 1 : -1,
        opacity: brightness,
        twinkle: Math.random() > 0.2, // More stars twinkle (80% chance)
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.03 + Math.random() * 0.04, // Faster twinkling
        glow: 8 + Math.random() * 15, // More glow
      })
    }

    // Create nebulas with enhanced properties
    const nebulaCount = isMobile ? 3 : 6
    nebulasRef.current = []

    // Nebula color palettes for different cosmic regions
    const nebulaColorSets = [
      // Purple-blue nebula
      ["rgba(111, 0, 255, 0.05)", "rgba(38, 0, 255, 0.05)", "rgba(0, 68, 255, 0.05)"],
      // Red-orange nebula
      ["rgba(255, 0, 0, 0.05)", "rgba(255, 98, 0, 0.05)", "rgba(255, 149, 0, 0.05)"],
      // Blue-cyan nebula
      ["rgba(0, 136, 255, 0.05)", "rgba(0, 208, 255, 0.05)", "rgba(0, 255, 234, 0.05)"],
      // Pink-purple nebula
      ["rgba(255, 0, 234, 0.05)", "rgba(255, 0, 149, 0.05)", "rgba(255, 0, 98, 0.05)"],
      // Green-blue nebula
      ["rgba(0, 255, 128, 0.05)", "rgba(0, 255, 200, 0.05)", "rgba(0, 200, 255, 0.05)"],
    ]

    for (let i = 0; i < nebulaCount; i++) {
      const colorSet = nebulaColorSets[Math.floor(Math.random() * nebulaColorSets.length)]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const baseRadius = (isMobile ? 150 : 300) + Math.random() * 200

      // Create multiple layers for each nebula for more depth
      for (let j = 0; j < 3; j++) {
        const radiusMultiplier = 0.7 + j * 0.3 // Different sizes for each layer
        nebulasRef.current.push({
          x,
          y,
          radius: baseRadius * radiusMultiplier,
          color: colorSet[j % colorSet.length],
          opacity: 0.05 + Math.random() * 0.15,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0001,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.001 + Math.random() * 0.002,
        })
      }
    }

    // Create galaxies
    const galaxyCount = isMobile ? 3 : 5
    galaxiesRef.current = []

    // Galaxy color palettes
    const galaxyColorSets = [
      // Spiral galaxy with blue-white core and yellow-orange arms
      {
        core: "rgba(180, 200, 255, 0.15)",
        arms: "rgba(255, 200, 100, 0.08)",
      },
      // Elliptical galaxy with reddish hue
      {
        core: "rgba(255, 150, 150, 0.12)",
        arms: "rgba(200, 100, 100, 0.06)",
      },
      // Bluish galaxy
      {
        core: "rgba(100, 150, 255, 0.15)",
        arms: "rgba(50, 100, 200, 0.08)",
      },
      // Purple galaxy
      {
        core: "rgba(180, 100, 255, 0.12)",
        arms: "rgba(120, 50, 200, 0.06)",
      },
    ]

    for (let i = 0; i < galaxyCount; i++) {
      const colorSet = galaxyColorSets[Math.floor(Math.random() * galaxyColorSets.length)]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = (isMobile ? 200 : 400) + Math.random() * 300
      const rotation = Math.random() * Math.PI * 2
      const spiralTightness = 0.1 + Math.random() * 0.2

      galaxiesRef.current.push({
        x,
        y,
        size,
        rotation,
        spiralTightness,
        rotationSpeed: (Math.random() - 0.5) * 0.0001,
        coreColor: colorSet.core,
        armsColor: colorSet.arms,
        opacity: 0.6 + Math.random() * 0.4,
      })
    }

    // Create cosmic dust particles
    const dustCount = isMobile ? 150 : 300
    dustParticlesRef.current = []

    for (let i = 0; i < dustCount; i++) {
      dustParticlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.3,
        color: `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, ${200 + Math.random() * 55}, 0.2)`,
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
      })
    }

    // Handle mouse movement for interactive stars
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    // Handle touch events for mobile interactivity
    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      setMousePosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return
      setMousePosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }

    const handleTouchEnd = () => {
      touchStartRef.current = null
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchstart", handleTouchStart)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)
    }

    // Animation loop with optimized rendering
    const animate = (timestamp: number) => {
      // Limit to 30fps for better performance
      const elapsed = timestamp - lastFrameTimeRef.current
      if (elapsed < 33) {
        // ~30fps
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // Limit frame rate based on device capability
      const fps = isMobile ? 24 : 30 // Lower FPS for mobile
      const fpsInterval = 1000 / fps
      if (elapsed < fpsInterval) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas with a deep space gradient - completely dark
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw galaxies
      galaxiesRef.current.forEach((galaxy) => {
        // Update galaxy rotation
        galaxy.rotation += galaxy.rotationSpeed

        ctx.save()
        ctx.translate(galaxy.x, galaxy.y)
        ctx.rotate(galaxy.rotation)

        // Draw galaxy core
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.3)
        coreGradient.addColorStop(0, galaxy.coreColor)
        coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(0, 0, galaxy.size * 0.3, 0, Math.PI * 2)
        ctx.fill()

        // Draw spiral arms
        const armCount = 2 + Math.floor(Math.random() * 3) // 2-4 arms
        const armLength = galaxy.size

        for (let arm = 0; arm < armCount; arm++) {
          const startAngle = (arm / armCount) * Math.PI * 2

          ctx.beginPath()
          ctx.moveTo(0, 0)

          for (let i = 0; i < 100; i++) {
            const t = i / 100
            const angle = startAngle + t * Math.PI * 2 * galaxy.spiralTightness * 5
            const radius = t * armLength

            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }

          ctx.strokeStyle = galaxy.armsColor
          ctx.lineWidth = galaxy.size * 0.1
          ctx.stroke()
        }

        ctx.restore()
      })

      // Draw nebulas with enhanced effects
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
        gradient.addColorStop(0, nebula.color.replace("0.05", "0.2"))
        gradient.addColorStop(0.4, nebula.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()

        // Draw an elliptical shape instead of a perfect circle
        const aspectRatio = 0.7 + Math.random() * 0.6
        ctx.ellipse(0, 0, nebula.radius, nebula.radius * aspectRatio, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      // Draw and update cosmic dust
      dustParticlesRef.current.forEach((dust, index) => {
        // Update position
        dust.x += dust.speedX
        dust.y += dust.speedY

        // Wrap around edges
        if (dust.x < 0) dust.x = canvas.width
        if (dust.x > canvas.width) dust.x = 0
        if (dust.y < 0) dust.y = canvas.height
        if (dust.y > canvas.height) dust.y = 0

        // Draw dust particle
        ctx.fillStyle = dust.color
        ctx.beginPath()
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw and update stars with enhanced effects
      starsRef.current.forEach((star, index) => {
        // Update star twinkle with smoother animation
        if (star.twinkle) {
          star.twinklePhase += star.twinkleSpeed
          star.opacity = 0.5 + Math.sin(star.twinklePhase) * 0.5
        }

        // Interactive star behavior
        if (interactive) {
          const dx = mousePosition.x - star.x
          const dy = mousePosition.y - star.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Make stars grow and glow when mouse is near
            const scale = 1 + (1 - distance / 150) * 1.5
            star.size = star.originalSize * scale
            star.glow = star.glow * 1.5
          } else {
            star.size = star.originalSize
          }
        }

        // Draw star with enhanced glow effect
        ctx.save()
        ctx.globalAlpha = star.opacity

        // Add enhanced glow effect
        ctx.shadowColor = star.color
        ctx.shadowBlur = star.glow

        // Draw the star
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // For larger stars, add a cross-shaped highlight for more sparkle
        if (star.size > 1.5) {
          const glowSize = star.size * 3
          ctx.strokeStyle = star.color
          ctx.lineWidth = 0.5
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
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [interactive, isMobile, starCount])

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-30"></div>
    </div>
  )
}
