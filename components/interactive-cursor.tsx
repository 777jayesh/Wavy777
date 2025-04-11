"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function InteractiveCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    // Only show cursor after first mouse movement
    const handleMouseEnter = () => setHidden(false)

    // Update cursor position
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    // Handle mouse clicks
    const handleMouseDown = (e: MouseEvent) => {
      setClicked(true)

      // Create sparkles on click
      const newSparkles = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        x: e.clientX + (Math.random() - 0.5) * 50,
        y: e.clientY + (Math.random() - 0.5) * 50,
      }))

      setSparkles((prev) => [...prev, ...newSparkles])

      // Remove sparkles after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)))
      }, 1000)
    }

    const handleMouseUp = () => setClicked(false)

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => setHidden(true)

    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (typeof window === "undefined") return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: clicked ? 0.8 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          x: { type: "spring", stiffness: 500, damping: 28 },
          y: { type: "spring", stiffness: 500, damping: 28 },
          scale: { type: "spring", stiffness: 500, damping: 10 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="relative">
          {/* Outer ring */}
          <div
            className={`w-8 h-8 rounded-full border-2 ${clicked ? "border-indigo-400" : "border-white"} opacity-70`}
          />

          {/* Inner dot */}
          <div
            className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full -translate-x-1/2 -translate-y-1/2 ${clicked ? "bg-indigo-400" : "bg-white"}`}
          />

          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-full ${clicked ? "bg-indigo-400" : "bg-white"} blur-md opacity-30`}
          />
        </div>
      </motion.div>

      {/* Sparkles on click */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="fixed pointer-events-none z-50"
            initial={{ x: sparkle.x - 10, y: sparkle.y - 10, scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  )
}
