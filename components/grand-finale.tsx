"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import Fireworks from "./fireworks"
import useMobileDetect from "@/hooks/use-mobile"

interface GrandFinaleProps {
  name: string
}

export default function GrandFinale({ name }: GrandFinaleProps) {
  const [showFireworks, setShowFireworks] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()

  useEffect(() => {
    // Sequence the animations
    const timeline = async () => {
      // Start with fireworks
      setShowFireworks(true)

      // After 2 seconds, show the message
      setTimeout(() => {
        setShowMessage(true)
      }, 2000)

      // After 3 seconds, show hearts
      setTimeout(() => {
        setShowHearts(true)
      }, 3000)
    }

    timeline()

    // Setup canvas for additional effects
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
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

    // Create sparkle particles
    const particleCount = isMobile ? 50 : 100
    const particles: {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      opacity: number
    }[] = []

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: getRandomColor(),
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.7 + 0.3,
      })
    }

    function getRandomColor() {
      const colors = [
        "#ff3d00", // Deep Orange
        "#ff9100", // Orange
        "#ffea00", // Yellow
        "#c6ff00", // Lime
        "#00e5ff", // Cyan
        "#2979ff", // Blue
        "#d500f9", // Purple
        "#f50057", // Pink
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -0.9
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -0.9
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationId)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {showFireworks && <Fireworks intensity="high" />}

      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 1,
            }}
            className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto mb-6 bg-amber-900/50 w-20 h-20 rounded-full flex items-center justify-center relative"
            >
              <Sparkles className="h-10 w-10 text-amber-500" />
              <motion.div
                className="absolute inset-0 rounded-full bg-amber-700"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 1.5,
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  repeatDelay: 0.5,
                }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-transparent bg-clip-text mb-4"
            >
              Happy Birthday, {name}!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white mb-6"
            >
              May your day be filled with joy, laughter, and all the love in the world!
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 text-transparent bg-clip-text"
            >
              Wishing you the very best! ✨
            </motion.div>
          </motion.div>
        </div>
      )}

      {showHearts && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                bottom: "-5%",
                left: `${5 + Math.random() * 90}%`,
                opacity: 0,
              }}
              animate={{
                bottom: "105%",
                opacity: [0, 0.8, 0],
                x: [0, Math.random() > 0.5 ? 50 : -50, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                delay: Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 2,
              }}
            >
              <Heart
                className="fill-red-500 text-red-500"
                style={{
                  width: `${20 + Math.random() * 30}px`,
                  height: `${20 + Math.random() * 30}px`,
                  filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))",
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
