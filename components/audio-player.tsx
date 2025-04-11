"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void
}

export default function AudioPlayer({ onPlayStateChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hona%20Tha%20Pyar%20%28Bol%29%20-%20%28Raag.Fm%29-X7Qi8ooO1QDJoSXzmA6NMz8XNzoIIf.mp3",
      )
      audioRef.current.loop = true
      audioRef.current.volume = 0.4
      audioRef.current.preload = "auto"

      // Add event listeners
      audioRef.current.addEventListener("canplaythrough", () => {
        setIsLoaded(true)
      })

      audioRef.current.addEventListener("play", () => {
        setIsPlaying(true)
        if (onPlayStateChange) onPlayStateChange(true)
      })

      audioRef.current.addEventListener("pause", () => {
        setIsPlaying(false)
        if (onPlayStateChange) onPlayStateChange(false)
      })
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current.remove()
        audioRef.current = null
      }
    }
  }, [onPlayStateChange])

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Try to play and handle autoplay restrictions
      audioRef.current.play().catch((error) => {
        console.log("Audio play prevented by browser:", error)
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={togglePlay}
      className="bg-[#0a0a1a]/70 backdrop-blur-sm border-indigo-600/50 text-indigo-100 hover:bg-indigo-900/50 transition-all duration-300"
      title={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 className="h-4 w-4 text-indigo-300" /> : <VolumeX className="h-4 w-4 text-indigo-300" />}
    </Button>
  )
}
