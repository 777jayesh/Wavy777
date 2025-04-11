"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Stars, ChevronRight, Camera } from "lucide-react"
import dynamic from "next/dynamic"
import { useWindowSize } from "react-use"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import TypewriterEffect from "@/components/typewriter-effect"
import useMobileDetect from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import Image from "next/image"
import PerformanceOptimizer from "@/components/performance-optimizer"
import CuteFooter from "@/components/cute-footer"
import PhotoFix from "@/components/photo-fix"
import AudioPlayer from "@/components/audio-player"
import { TransitionEffect, pageTransitions } from "@/components/enhanced-transitions"

// Dynamically imported components for better performance
const EnhancedBackground = dynamic(() => import("@/components/enhanced-background"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050714]" />,
})

const GlisteningStars = dynamic(() => import("@/components/glistening-stars"), {
  ssr: false,
})

const SpaceObjects = dynamic(() => import("@/components/space-objects"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none" />,
})

const FloatingHearts = dynamic(() => import("@/components/floating-hearts"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none" />,
})

const MessageReveal = dynamic(() => import("@/components/message-reveal"), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl w-full bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-700 animate-pulse">
      <div className="h-64 flex items-center justify-center">
        <Heart className="h-8 w-8 text-indigo-500 animate-pulse" />
      </div>
    </div>
  ),
})

const VideoGallery = dynamic(() => import("@/components/video-gallery"), {
  loading: () => (
    <div className="w-full aspect-[16/9] bg-[#0a0a1a]/80 animate-pulse rounded-lg flex items-center justify-center">
      <Camera className="h-8 w-8 text-indigo-500 animate-pulse" />
    </div>
  ),
  ssr: false,
})

const WishForm = dynamic(() => import("@/components/wish-form"), {
  loading: () => (
    <div className="w-full bg-[#0a0a1a]/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-700 animate-pulse">
      <div className="h-40"></div>
    </div>
  ),
  ssr: false,
})

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none" />,
})

export default function HomePage() {
  // All state declarations at the top level
  const [step, setStep] = useState(0) // Start directly at first step for better performance
  const [direction, setDirection] = useState(1) // For direction-aware transitions
  const [showConfetti, setShowConfetti] = useState(false)
  const [userWish, setUserWish] = useState("")
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [transitionType, setTransitionType] = useState("flip")

  // Refs
  const containerRef = useRef(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  // Hooks
  const { width, height } = useWindowSize()
  const isMobile = useMobileDetect()
  const { setTheme } = useTheme()

  // Cycle through transition types for variety
  const cycleTransitionType = useCallback(() => {
    const types = ["flip", "rotate", "scale", "slideRight", "fade"]
    const currentIndex = types.indexOf(transitionType)
    const nextIndex = (currentIndex + 1) % types.length
    setTransitionType(types[nextIndex])
  }, [transitionType])

  // Simulate loading for smoother initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleWishSubmit = useCallback((wish) => {
    setUserWish(wish)
    setShowFinalMessage(true)

    // Start with confetti
    setShowConfetti(true)

    // End the celebration after 10 seconds
    setTimeout(() => {
      setShowConfetti(false)
    }, 10000)
  }, [])

  const nextStep = useCallback(() => {
    setDirection(1) // Forward direction
    setStep((prev) => prev + 1)
    cycleTransitionType()
  }, [cycleTransitionType])

  const prevStep = useCallback(() => {
    if (step > 0) {
      setDirection(-1) // Backward direction
      setStep((prev) => prev - 1)
      cycleTransitionType()
    }
  }, [step, cycleTransitionType])

  const handleMusicStateChange = useCallback((isPlaying: boolean) => {
    setMusicPlaying(isPlaying)
  }, [])

  // Ensure theme is set to dark
  useEffect(() => {
    setTheme("dark")
  }, [setTheme])

  // Set mounted state
  useEffect(() => {
    setHasMounted(true)

    // Add cute font with better loading strategy
    const fontLink = document.createElement("link")
    fontLink.href = "https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
    fontLink.rel = "stylesheet"
    fontLink.crossOrigin = "anonymous"
    document.head.appendChild(fontLink)

    // Add font-display swap for better loading
    const fontStyle = document.createElement("style")
    fontStyle.textContent = `
      @font-face {
        font-family: 'Quicksand';
        font-style: normal;
        font-weight: 300 700;
        font-display: swap;
      }
      
      body, button, input, textarea {
        font-family: 'Quicksand', sans-serif;
      }
      
      /* Ensure consistent colors across devices */
      :root {
        color-scheme: dark;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Improve animations */
      * {
        will-change: transform, opacity;
        backface-visibility: hidden;
      }
    `
    document.head.appendChild(fontStyle)

    document.body.style.fontFamily = "'Quicksand', sans-serif"

    return () => {
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink)
      if (document.head.contains(fontStyle)) document.head.removeChild(fontStyle)
    }
  }, [])

  // Define steps array inside the component so it has access to handleWish Submit and userWish
  const steps = [
    // Step 0: Initial greeting with beautiful background
    <TransitionEffect
      key="welcome"
      direction={direction}
      type={transitionType}
      className="h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden hardware-accelerated"
    >
      <motion.div
        variants={pageTransitions.content}
        initial="hidden"
        animate="visible"
        className="max-w-lg z-20 bg-[#0a0a1a]/70 backdrop-blur-md p-8 rounded-xl border border-indigo-600/50 shadow-2xl hardware-accelerated"
        style={{
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.2)",
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        <motion.div
          variants={pageTransitions.item}
          className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indigo-600/70 shadow-lg hardware-accelerated"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Image
            src="/images/profile.jpg"
            alt="Sneha"
            width={96}
            height={96}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>

        <motion.h1
          variants={pageTransitions.item}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text mb-6 hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}
        >
          Hello Sneha
        </motion.h1>

        <motion.p
          variants={pageTransitions.item}
          className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
        >
          On this special day, I've created something just for you. A journey through our memories, emotions, and the
          beautiful moments we've shared.
        </motion.p>

        <motion.div
          variants={pageTransitions.item}
          whileHover="hover"
          whileTap="tap"
          initial="rest"
          className="relative"
        >
          <Button
            onClick={nextStep}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 border-none relative overflow-hidden group text-white hardware-accelerated"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
          >
            <span className="relative z-10 flex items-center">
              Begin Your Journey{" "}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
            />
          </Button>
        </motion.div>
      </motion.div>
    </TransitionEffect>,

    // Step 1: Emotional message with beautiful background
    <TransitionEffect
      key="emotional-message"
      direction={direction}
      type={transitionType}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden hardware-accelerated"
    >
      <motion.div
        variants={pageTransitions.content}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-[#0a0a1a]/70 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-indigo-600/50 z-20 hardware-accelerated"
        style={{
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.2)",
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        <motion.div
          variants={pageTransitions.item}
          className="mb-6 hardware-accelerated"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 fill-red-500" />
        </motion.div>

        <motion.h1
          variants={pageTransitions.item}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text mb-6 hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}
        >
          Every Moment With You
        </motion.h1>

        <motion.div variants={pageTransitions.item} className="mb-8 hardware-accelerated">
          <TypewriterEffect
            text="In a world full of ordinary moments, I found something extraordinary in you. Every smile, every laugh, every conversation has been etched into my heart forever."
            delay={30}
            className="text-lg md:text-xl text-indigo-100 leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
          />
        </motion.div>

        <motion.div variants={pageTransitions.item} className="mb-8 hardware-accelerated">
          <p
            className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
          >
            Today is your special day, and I want to take you on a journey through our memories, to show you just how
            much you mean to me...
          </p>

          <div className="flex justify-between">
            <motion.div
              variants={pageTransitions.button}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
              className="relative"
            >
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-indigo-600/50 text-indigo-100 hover:bg-indigo-900/50 relative overflow-hidden group hardware-accelerated"
                style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
              >
                <span className="relative z-10">Go Back</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                />
              </Button>
            </motion.div>

            <motion.div
              variants={pageTransitions.button}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
              className="relative"
            >
              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 border-none relative overflow-hidden group text-white hardware-accelerated"
                style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
              >
                <span className="relative z-10 flex items-center">
                  Continue{" "}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </TransitionEffect>,

    // Step 2: Birthday wish with beautiful background
    <TransitionEffect
      key="birthday-wish"
      direction={direction}
      type={transitionType}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden hardware-accelerated"
    >
      <FloatingHearts count={20} />

      <motion.div
        variants={pageTransitions.content}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-[#0a0a1a]/70 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-indigo-600/50 z-20 hardware-accelerated"
        style={{
          boxShadow: "0 0 30px rgba(79, 70, 229, 0.2)",
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        <motion.div
          variants={pageTransitions.item}
          className="mb-6 hardware-accelerated"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Stars className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        </motion.div>

        <motion.h1
          variants={pageTransitions.item}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text mb-6 hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}
        >
          Happy Birthday, Sneha!
        </motion.h1>

        <motion.div variants={pageTransitions.item} className="mb-8 hardware-accelerated">
          <TypewriterEffect
            text="Today is all about celebrating the amazing person you are. Your kindness, your smile, your spirit - everything that makes you uniquely you."
            delay={30}
            className="text-lg md:text-xl text-indigo-100 leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
          />
        </motion.div>

        <motion.div variants={pageTransitions.item} className="mb-8 hardware-accelerated">
          <p
            className="text-lg md:text-xl text-indigo-100 mb-8 leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
          >
            I've prepared a special journey...... Let's continue to see what's next...
          </p>

          <div className="flex justify-between">
            <motion.div
              variants={pageTransitions.button}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
              className="relative"
            >
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-indigo-600/50 text-indigo-100 hover:bg-indigo-900/50 relative overflow-hidden group hardware-accelerated"
                style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
              >
                <span className="relative z-10">Go Back</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                />
              </Button>
            </motion.div>

            <motion.div
              variants={pageTransitions.button}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
              className="relative"
            >
              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 border-none relative overflow-hidden group text-white hardware-accelerated"
                style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
              >
                <span className="relative z-10 flex items-center">
                  Glimpses Of Yours{" "}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </TransitionEffect>,

    // Step 3: Video memories with gallery
    <TransitionEffect
      key="video-memories"
      direction={direction}
      type={transitionType}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative hardware-accelerated"
    >
      <motion.div
        variants={pageTransitions.content}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full mx-auto mb-8 text-center z-10 hardware-accelerated"
      >
        <motion.div
          variants={pageTransitions.item}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="hardware-accelerated flex items-center justify-center gap-2"
        >
          <Camera className="h-8 w-8 text-blue-400 mb-4" />
          <Heart className="h-8 w-8 text-red-500 fill-red-500 mb-4" />
        </motion.div>

        <motion.h2
          variants={pageTransitions.item}
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 mb-4 hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}
        >
          Glimpses of Yours from My Gallery
        </motion.h2>

        <motion.p
          variants={pageTransitions.item}
          className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
        >
          Every moment with you is a treasure. I'll cherish it forever...
        </motion.p>
      </motion.div>

      <motion.div variants={pageTransitions.item} className="w-full max-w-4xl z-10 hardware-accelerated">
        <VideoGallery />
      </motion.div>

      <motion.div variants={pageTransitions.item} className="mt-8 text-center z-10 hardware-accelerated">
        <div className="flex justify-between">
          <motion.div
            variants={pageTransitions.button}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            className="relative"
          >
            <Button
              onClick={prevStep}
              variant="outline"
              className="border-indigo-600/50 bg-[#0a0a1a]/70 text-indigo-100 hover:bg-indigo-900/50 relative overflow-hidden group hardware-accelerated"
              style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
            >
              <span className="relative z-10">Go Back</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
              />
            </Button>
          </motion.div>

          <motion.div
            variants={pageTransitions.button}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            className="relative"
          >
            <Button
              onClick={nextStep}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 border-none relative overflow-hidden group text-white hardware-accelerated"
              style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
            >
              <span className="relative z-10 flex items-center">
                Make Your Wish{" "}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
              />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </TransitionEffect>,

    // Step 4: Make a wish with beautiful background
    <TransitionEffect
      key="make-wish"
      direction={direction}
      type={transitionType}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden hardware-accelerated"
    >
      <FloatingHearts count={15} />

      <motion.div
        variants={pageTransitions.content}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full mx-auto mb-8 text-center z-10 hardware-accelerated"
      >
        <motion.div
          variants={pageTransitions.item}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="hardware-accelerated"
        >
          <Stars className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        </motion.div>

        <motion.h2
          variants={pageTransitions.item}
          className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 mb-4 hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}
        >
          Make a Birthday Wish
        </motion.h2>

        <motion.p
          variants={pageTransitions.item}
          className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed hardware-accelerated"
          style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}
        >
          It's your special day. Close your eyes, make a wish, and let me know what your heart desires...
        </motion.p>
      </motion.div>

      {!showFinalMessage ? (
        <motion.div variants={pageTransitions.item} className="w-full max-w-md z-30 hardware-accelerated">
          <WishForm onSubmit={handleWishSubmit} />
        </motion.div>
      ) : (
        <MessageReveal wish={userWish} />
      )}

      {!showFinalMessage && (
        <motion.div variants={pageTransitions.item} className="mt-8 text-center z-10 hardware-accelerated">
          <motion.div
            variants={pageTransitions.button}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            className="relative"
          >
            <Button
              onClick={prevStep}
              variant="outline"
              className="border-indigo-600/50 bg-[#0a0a1a]/70 text-indigo-100 hover:bg-indigo-900/50 relative overflow-hidden group hardware-accelerated"
              style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600 }}
            >
              <span className="relative z-10">Go Back</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 hardware-accelerated"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
              />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </TransitionEffect>,
  ]

  if (!hasMounted) {
    return null
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050714] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Heart className="h-12 w-12 text-indigo-500 animate-pulse mb-4" />
          <p className="text-indigo-100" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 500 }}>
            Loading your special surprise...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[#050714] text-indigo-100 relative overflow-hidden"
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      {/* Photo fix for specific images */}
      <PhotoFix />

      {/* Performance optimizer */}
      <PerformanceOptimizer />

      {/* Enhanced background */}
      <EnhancedBackground />

      {/* Glistening stars overlay */}
      <GlisteningStars density="high" speed="medium" />

      {/* Space objects (moon, planets, etc.) */}
      <SpaceObjects />

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={isMobile ? 80 : 150}
          colors={["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#0891b2", "#8b5cf6", "#a78bfa"]}
        />
      )}

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <AudioPlayer onPlayStateChange={handleMusicStateChange} />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {steps[step]}
      </AnimatePresence>

      {step > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {Array.from({ length: steps.length }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i === step
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 scale-125"
                  : "bg-indigo-900 hover:bg-indigo-800",
              )}
              whileHover={{ scale: 1.5 }}
              onClick={() => {
                setDirection(i < step ? -1 : 1)
                setStep(i)
                cycleTransitionType()
              }}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      )}

      {/* Cute Footer */}
      <CuteFooter />
    </main>
  )
}
