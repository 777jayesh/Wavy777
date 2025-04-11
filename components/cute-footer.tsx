"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function CuteFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
    >
      <div className="container mx-auto flex justify-center items-center">
        <motion.p
          className="text-sm md:text-base text-white/90 font-medium flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          Made with{" "}
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              repeatDelay: 0.5,
            }}
            className="inline-flex"
          >
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          </motion.span>{" "}
          for Sneha
        </motion.p>
      </div>
    </motion.div>
  )
}
