"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import { useMediaQuery } from "usehooks-ts"

interface LoadingScreenProps {
  progress: number
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const roundedProgress = Math.min(100, Math.round(progress))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressAnimation = useMotionValue(0)
  const progressDisplay = useTransform(progressAnimation, Math.round)
  const controls = useAnimation()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update progress animation
  useEffect(() => {
    progressAnimation.set(roundedProgress)
  }, [roundedProgress, progressAnimation])

  // Optimize loading screen for faster performance
  // Replace the useEffect with the particle system with this optimized version:

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with high DPI support
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Optimized Particle class with enhanced visuals
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      glow: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 1.5 // Reduced speed for smoother movement
        this.speedY = (Math.random() - 0.5) * 1.5

        // Enhanced vibrant color palette
        const colors = [
          "rgba(6, 182, 212, 0.9)", // cyan-500
          "rgba(14, 165, 233, 0.9)", // sky-500
          "rgba(59, 130, 246, 0.9)", // blue-500
          "rgba(139, 92, 246, 0.9)", // violet-500
          "rgba(236, 72, 153, 0.9)", // pink-500
          "rgba(249, 115, 22, 0.9)", // orange-500
          "rgba(16, 185, 129, 0.9)", // emerald-500
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.glow = 5 + Math.random() * 5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges with damping
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX * 0.9
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY * 0.9
        }

        // Apply slight friction
        this.speedX *= 0.99
        this.speedY *= 0.99
      }

      draw() {
        ctx.save()

        // Add glow effect
        ctx.shadowColor = this.color
        ctx.shadowBlur = this.glow

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // Create particles based on progress - more particles as progress increases
    const maxParticles = isMobile ? 50 : 100
    const particleCount = Math.min(maxParticles, Math.floor((progress / 100) * maxParticles) + 10)
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle())

    // Optimized animation loop with throttling
    let animationFrameId: number
    let lastTime = 0
    const fps = 60 // Increased to 60fps for smoother animation
    const fpsInterval = 1000 / fps

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate)

      // Throttle frame rate
      const elapsed = timestamp - lastTime
      if (elapsed < fpsInterval) return
      lastTime = timestamp - (elapsed % fpsInterval)

      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)" // Reduced opacity for longer trails
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [progress, isMobile])

  // Trigger final animation when loading completes
  useEffect(() => {
    if (roundedProgress >= 100) {
      controls.start({
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        transition: { duration: 0.8, times: [0, 0.7, 1] },
      })
    }
  }, [roundedProgress, controls])

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50"
      animate={controls}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.2,
          }}
          className="mb-6 inline-block relative"
        >
          <Heart className="h-16 w-16 text-red-500 fill-red-500" />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 1.4,
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.2,
              repeatDelay: 0.1,
            }}
          />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6">Creating Something Special</h1>

        <div className="w-64 md:w-72 h-2 bg-slate-800 rounded-full overflow-hidden mb-3 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${roundedProgress}%` }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-16 bg-white/20"
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.2,
              ease: "linear",
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <motion.p className="text-slate-300">
            <motion.span>{progressDisplay}</motion.span>%
          </motion.p>
          <p className="text-slate-300">- Loading memories...</p>
        </div>

        <motion.div
          className="absolute -z-10"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "linear",
          }}
        >
          <Sparkles className="h-40 w-40 text-blue-800 opacity-30" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
