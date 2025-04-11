"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

interface ParallaxBackgroundProps {
  imageUrl: string
  overlayColor?: string
  parallaxStrength?: number
}

export default function ParallaxBackground({
  imageUrl,
  overlayColor = "from-slate-900 via-slate-800 to-emerald-900",
  parallaxStrength = 0.1,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollY } = useScroll()

  // Calculate the parallax effect
  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [`${-parallaxStrength * 100}%`, `${parallaxStrength * 100}%`],
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updatePosition = () => {
      const rect = element.getBoundingClientRect()
      setElementTop(rect.top + window.scrollY)
      setClientHeight(window.innerHeight)
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("resize", updatePosition)
    }
  }, [ref])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0 w-full h-[120%] -top-[10%]" style={{ y }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${overlayColor} opacity-70 z-10`}></div>
        <div className="absolute inset-0 bg-black/30 z-[5]"></div>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Background"
          fill
          className={`object-cover transition-opacity duration-1000 z-0 ${isLoaded ? "opacity-60" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          priority
        />
      </motion.div>

      {/* Gradient overlay at the bottom for better text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
    </div>
  )
}
