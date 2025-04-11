"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import useMobileDetect from "@/hooks/use-mobile"

// These are the videos that will be displayed in the gallery with cute, teasy, flirty captions
const galleryVideos = [
  {
    id: "video-1",
    src: "/videos/memory-1.mp4",
    caption: "💘That twirl is cute, but your dimples? Deadly!",
  },
  {
    id: "video-2",
    src: "/videos/memory-2.mp4",
    caption: "Is it hot in here or is it just you? 🔥",
  },
  {
    id: "video-3",
    src: "/videos/memory-3.mp4",
    caption: "That sparkle in your eyes makes my heart skip a beat ❤️",
  },
  {
    id: "video-4",
    src: "/videos/memory-4.mp4",
    caption: "The ocean is deep, but tera asar aur bhi gehra hai! 😏💘",
  },
  {
    id: "video-5",
    src: "/videos/memory-5.mp4",
    caption: "Simplicity ka alag hi charm hota hai… aur tu uska perfect example hai! 💃✨",
  },
  {
    id: "video-6",
    src: "/videos/memory-6.mp4",
    caption: "💃 Mirror mirror on the wall, who's the cutest Garba queen of them all? (Hint: It's Sneha!) 😘",
  },
  {
    id: "video-7",
    src: "/videos/memory-7.mp4",
    caption: "Spiritual vibes, peaceful mind… but still completely distracted by you! 🤭🔥",
  },
  {
    id: "photo-1",
    type: "image",
    src: "/images/memory-1.jpg",
    caption: "Baapu Daayroo , HAA PATEL HAA ",
  },
  {
    id: "photo-2",
    type: "image",
    src: "/images/memory-2.jpg",
    caption: "Blue is definitely our color! We will look amazing together (If we are couple)! 💙",
  },
  {
    id: "photo-3",
    type: "image",
    src: "/images/memory-3.jpg",
    caption: "That peaceful smile in nature... absolutely breathtaking! 💚",
  },
]

export default function VideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [touchStartX, setTouchStartX] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)
  const isMobile = useMobileDetect()

  // Handle navigation
  const handlePrev = () => {
    pauseCurrentVideo()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryVideos.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    pauseCurrentVideo()
    setCurrentIndex((prevIndex) => (prevIndex === galleryVideos.length - 1 ? 0 : prevIndex + 1))
  }

  // Video control functions
  const pauseCurrentVideo = () => {
    if (videoRef.current && !isCurrentItemImage()) {
      videoRef.current.pause()
      setIsPlaying(false)
    }

    if (fullscreenVideoRef.current && !isCurrentItemImage()) {
      fullscreenVideoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Check if current item is an image
  const isCurrentItemImage = () => {
    return galleryVideos[currentIndex]?.type === "image"
  }

  // UI interaction handlers
  const handleVideoClick = () => {
    setIsFullscreen(true)
  }

  const handleVideoDoubleClick = () => {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1000)
  }

  const handleThumbnailClick = (index: number) => {
    pauseCurrentVideo()
    setCurrentIndex(index)
  }

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      setTouchStartX(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touchEndX = e.changedTouches[0].clientX
      const diffX = touchEndX - touchStartX

      // Swipe threshold
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handlePrev()
        } else {
          handleNext()
        }
      }
    }
  }

  // Reset video when changing
  useEffect(() => {
    const resetVideo = () => {
      if (videoRef.current && !isCurrentItemImage()) {
        videoRef.current.currentTime = 0
        videoRef.current.load()
        // Auto-play the video silently
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }

      if (fullscreenVideoRef.current && !isCurrentItemImage()) {
        fullscreenVideoRef.current.currentTime = 0
        fullscreenVideoRef.current.load()
        fullscreenVideoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    }

    resetVideo()
  }, [currentIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
        setIsPlaying(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, isPlaying])

  // Handle fullscreen exit
  useEffect(() => {
    if (!isFullscreen) {
      setIsPlaying(false)
    }
  }, [isFullscreen])

  // Safely get current item
  const currentItem = galleryVideos[currentIndex] || galleryVideos[0]

  return (
    <div className="w-full">
      <Card className="bg-[#0a0a1a]/80 backdrop-blur-md overflow-hidden border border-indigo-600/50">
        <CardContent className="p-4 md:p-8">
          <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="aspect-[16/9] bg-[#111133]/50 rounded-lg overflow-hidden">
              <motion.div className="relative w-full h-full" onDoubleClick={handleVideoDoubleClick}>
                <motion.div
                  key={`media-${currentIndex}`}
                  className="w-full h-full"
                  onClick={handleVideoClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCurrentItemImage() ? (
                    <div className="relative w-full h-full">
                      <img
                        src={currentItem.src || "/placeholder.svg"}
                        alt={`Gallery image ${currentIndex + 1}`}
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={currentItem.src}
                      className="w-full h-full object-contain md:object-cover cursor-pointer"
                      playsInline
                      muted={isMuted}
                      loop
                      autoPlay
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <p className="text-lg font-medium">{currentItem.caption}</p>
                    <p className="text-sm opacity-80">
                      {currentIndex + 1} / {galleryVideos.length}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/30 border-indigo-600/50 text-white hover:bg-black/50"
                    onClick={handleVideoClick}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {showHeart && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Heart className="h-20 w-20 text-red-500 fill-red-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 border-indigo-600/50 text-white hover:bg-black/50 z-10"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 border-indigo-600/50 text-white hover:bg-black/50 z-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-indigo-100">Glimpses of yours from my gallery</h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
              {galleryVideos.map((item, index) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden cursor-pointer relative",
                    index === currentIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-indigo-800/50",
                  )}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <div className="w-full h-full bg-black/50">
                    {item.type === "image" ? (
                      <img
                        src={item.src || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: item.id === "photo-2" ? "center top" : "center center" }}
                      />
                    ) : (
                      <video
                        src={item.src}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        autoPlay
                        onMouseOver={(e) => {
                          try {
                            e.currentTarget.play().catch(() => {})
                          } catch (err) {}
                        }}
                        onMouseOut={(e) => {
                          try {
                            e.currentTarget.pause()
                          } catch (err) {}
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsFullscreen(false)
              setIsPlaying(false)
            }}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-transparent border-indigo-600/50 text-white hover:bg-indigo-900/50 z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="h-6 w-6" />
            </Button>

            <motion.div
              className="relative max-w-full max-h-[90vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isCurrentItemImage() ? (
                <img
                  src={currentItem.src || "/placeholder.svg"}
                  alt={`Gallery image ${currentIndex + 1}`}
                  className="max-w-full max-h-[90vh] w-auto h-auto object-contain mx-auto"
                />
              ) : (
                <video
                  ref={fullscreenVideoRef}
                  src={currentItem.src}
                  className="max-w-full max-h-[90vh] object-contain mx-auto"
                  playsInline
                  muted={isMuted}
                  loop
                  autoPlay
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 text-center text-white">
              <p className="text-lg font-medium">{currentItem.caption}</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent border-indigo-600/50 text-white hover:bg-indigo-900/50"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-indigo-600/50 text-white hover:bg-indigo-900/50"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
