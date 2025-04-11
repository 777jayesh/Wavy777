"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface WishFormProps {
  onSubmit: (wish: string) => void
}

export default function WishForm({ onSubmit }: WishFormProps) {
  const [wish, setWish] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (wish.trim()) {
      setIsSubmitting(true)

      // Simulate a small delay for effect
      setTimeout(() => {
        onSubmit(wish)
      }, 1500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0a0a1a]/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-600/50 relative overflow-hidden"
      style={{
        boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
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

        <motion.div
          className="absolute -top-10 -right-10 opacity-20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 30,
            ease: "linear",
          }}
        >
          <Sparkles className="h-40 w-40 text-indigo-400" />
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label htmlFor="wish" className="block text-sm font-medium text-indigo-200 mb-2">
            Your Birthday Wish
          </label>
          <Textarea
            id="wish"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="I wish for..."
            className="min-h-[120px] resize-none bg-[#111133]/60 border-indigo-600/50 text-indigo-100 placeholder:text-indigo-400/50 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={!wish.trim() || isSubmitting}
            className={cn(
              "relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-none text-white",
              isSubmitting && "bg-gradient-to-r from-indigo-600 to-blue-600",
            )}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Making your wish come true</span>
                <span className="animate-pulse">...</span>
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Make My Wish</span>
              </>
            )}

            {isSubmitting && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/20 to-indigo-600/0"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
              />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
