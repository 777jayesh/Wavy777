"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import useMobileDetect from "@/hooks/use-mobile"
import Image from "next/image"

// These are the images that will be displayed in the gallery
// Replace these with your own images by adding them to the public/images folder
const galleryImages = [
  {
    src: "/images/memory-1.jpg",
    caption: "Our first movie together",
  },
  {
    src: "/images/memory-2.jpg",
    caption: "That time we went hiking",
  },
  {
    src: "/images/memory-3.jpg",
    caption: "Your birthday last year",
  },
  {
    src: "/images/memory-4.jpg",
    caption: "The day we met",
  },
  {
    src: "/images/memory-5.jpg",
    caption: "Our favorite coffee shop",
  },
  {
    src: "/images/memory-6.jpg",
    caption: "That beautiful sunset we watched",
  },
]

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobileDetect()

  // For 3D tilt effect
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1))
  }

  const handleImageClick = () => {
    setIsFullscreen(true)
  }

  const handleImageDoubleClick = () => {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1000)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isMobile) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate tilt based on mouse position relative to center
    const tiltAmountX = ((e.clientX - centerX) / (rect.width / 2)) * 5 // Max 5 degrees
    const tiltAmountY = ((e.clientY - centerY) / (rect.height / 2)) * 5 // Max 5 degrees

    setTiltX(-tiltAmountY) // Invert Y for natural tilt
    setTiltY(tiltAmountX)
  }

  const handleMouseLeave = () => {
    // Reset tilt when mouse leaves
    setTiltX(0)
    setTiltY(0)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setDragStartX(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const dragDistance = e.changedTouches[0].clientX - dragStartX
      if (dragDistance > 50) {
        handlePrev()
      } else if (dragDistance < -50) {
        handleNext()
      }
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  return (
    <div className="w-full">
      <Card className="bg-[#0a0a1a]/80 backdrop-blur-md overflow-hidden border border-indigo-600/50">
        <CardContent className="p-6 md:p-8">
          <div
            className="relative"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="aspect-[16/9] bg-[#111133]/50 rounded-lg overflow-hidden">
              <motion.div
                className="relative w-full h-full"
                onDoubleClick={handleImageDoubleClick}
                style={{
                  transform: isMobile ? undefined : `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <motion.div
                  key={currentIndex}
                  className="w-full h-full"
                  onClick={handleImageClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={galleryImages[currentIndex].src || "/placeholder.svg"}
                    alt={`Gallery image ${currentIndex + 1}`}
                    fill
                    className="object-cover cursor-pointer"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
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

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <p className="text-lg font-medium">{galleryImages[currentIndex].caption}</p>
                  <p className="text-sm opacity-80">
                    {currentIndex + 1} / {galleryImages.length}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/30 border-indigo-600/50 text-white hover:bg-black/50"
                  onClick={handleImageClick}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
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
              <h3 className="text-lg font-medium text-indigo-100">Our Memories</h3>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden cursor-pointer",
                    index === currentIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-indigo-800/50",
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
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
            onClick={() => setIsFullscreen(false)}
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
              className="relative max-w-full max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={galleryImages[currentIndex].src || "/placeholder.svg"}
                alt={`Gallery image ${currentIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 text-center text-white">
              <p className="text-lg font-medium">{galleryImages[currentIndex].caption}</p>
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
