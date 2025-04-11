"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import useMobileDetect from "@/hooks/use-mobile"

interface HeartShape {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
  color: string
  rotate: number
  scale: number
  glow: number
}

interface FloatingHeartsProps {
  count?: number
  intensity?: "low" | "medium" | "high"
}

export default function FloatingHearts({ count = 10, intensity = "medium" }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<HeartShape[]>([])
  const isMobile = useMobileDetect()

  // Adjust heart count based on device and intensity
  let actualCount = isMobile ? Math.floor(count * 0.7) : count

  switch (intensity) {
    case "low":
      actualCount = Math.floor(actualCount * 0.7)
      break
    case "high":
      actualCount = Math.floor(actualCount * 1.5)
      break
  }

  // Enhanced color palette with blues and purples
  const colors = useMemo(
    () => [
      "text-red-500 fill-red-500",
      "text-red-600 fill-red-600",
      "text-rose-500 fill-rose-500",
      "text-rose-600 fill-rose-600",
      "text-pink-500 fill-pink-500",
      "text-pink-600 fill-pink-600",
      "text-indigo-400 fill-indigo-400",
      "text-blue-400 fill-blue-400",
    ],
    [],
  )

  useEffect(() => {
    // Generate hearts with optimized properties
    const newHearts = Array.from({ length: actualCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random x position (0-100%)
      delay: Math.random() * 3, // reduced delay range (0-3s)
      duration: 7 + Math.random() * 10, // reduced duration range (7-17s)
      size: 16 + Math.random() * 20, // reduced size range (16-36px)
      opacity: 0.6 + Math.random() * 0.4, // opacity (0.6-1)
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360, // random rotation
      scale: 0.8 + Math.random() * 0.4, // random scale
      glow: Math.random() > 0.7 ? 10 : 0, // some hearts have glow
    }))

    setHearts(newHearts)
  }, [actualCount, colors])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: `${heart.x}%` }}
          initial={{ y: "100%", opacity: 0, rotate: heart.rotate, scale: heart.scale }}
          animate={{
            y: "-100%",
            opacity: [0, heart.opacity, heart.opacity, 0],
            x: ["-2%", "2%", "-1%", "1%", "0%"],
            rotate: [heart.rotate, heart.rotate + 15, heart.rotate - 15, heart.rotate],
            scale: [heart.scale, heart.scale * 1.1, heart.scale * 0.9, heart.scale],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
            x: {
              duration: heart.duration / 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            },
            rotate: {
              duration: heart.duration / 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            },
            scale: {
              duration: heart.duration / 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }}
        >
          <Heart
            className={`${heart.color}`}
            style={{
              width: heart.size,
              height: heart.size,
              filter: heart.glow ? `drop-shadow(0 0 ${heart.glow}px rgba(255, 0, 0, 0.5))` : "none",
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
