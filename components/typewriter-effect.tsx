"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  text: string
  delay?: number
  className?: string
}

export default function TypewriterEffect({ text, delay = 50, className }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return (
    <p className={cn("", className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </p>
  )
}
