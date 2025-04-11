"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import TypewriterEffect from "@/components/typewriter-effect"
import Link from "next/link"

interface MessageRevealProps {
  wish: string
}

export default function MessageReveal({ wish }: MessageRevealProps) {
  const [stage, setStage] = useState(0)
  const [showStartOver, setShowStartOver] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1)
    }, 3000)

    // Show start over button after celebration ends
    const startOverTimer = setTimeout(() => {
      setShowStartOver(true)
    }, 12000)

    return () => {
      clearTimeout(timer)
      clearTimeout(startOverTimer)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl w-full bg-[#0a0a1a]/90 backdrop-blur-md rounded-xl p-8 shadow-xl border border-indigo-600/50 relative overflow-hidden z-30"
      style={{
        boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "linear",
            }}
          >
            <Sparkles className="h-40 w-40 text-indigo-600 opacity-30" />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10">
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 25,
              ease: "linear",
            }}
          >
            <Sparkles className="h-40 w-40 text-blue-600 opacity-30" />
          </motion.div>
        </div>

        {/* Enhanced animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "linear-gradient(45deg, #4f46e5 0%, #0ea5e9 100%)",
              "linear-gradient(45deg, #0ea5e9 0%, #4f46e5 100%)",
              "linear-gradient(45deg, #4f46e5 0%, #0ea5e9 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="text-center mb-6 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mx-auto mb-4 bg-indigo-900/50 w-16 h-16 rounded-full flex items-center justify-center relative"
        >
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-700"
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

        <h3 className="text-2xl font-bold text-white mb-2">Your Wish</h3>

        <div className="bg-[#111133]/50 p-4 rounded-lg mb-6 border border-indigo-800/50 backdrop-blur-sm">
          <p className="text-indigo-100 italic">"{wish}"</p>
        </div>
      </div>

      {stage >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          <div className="mb-6">
            <TypewriterEffect
              text="I pray that all your wishes come true..."
              delay={50}
              className="text-lg text-indigo-100 mb-4"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text"
            >
              But my wish is you. ❤️
            </motion.p>
          </div>

          {showStartOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <p className="text-indigo-100 mb-6">
                Thank you for being the amazing person you are. I hope this birthday brings you all the happiness you
                deserve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full sm:w-auto border-indigo-600 text-indigo-100 hover:bg-indigo-900/50 relative overflow-hidden group"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span className="relative z-10">Start Over</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                    />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/portfolio" passHref>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white relative overflow-hidden group"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span className="relative z-10">View My Portfolio</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
                      />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
