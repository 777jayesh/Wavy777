"use client"

import { motion } from "framer-motion"

// Enhanced page transition variants
export const pageTransitions = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },

  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },

  slideRight: (direction: number) => ({
    initial: { opacity: 0, x: direction > 0 ? -100 : 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: direction > 0 ? 100 : -100, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }),

  scale: (direction: number) => ({
    initial: { opacity: 0, scale: direction > 0 ? 0.8 : 1.2 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: direction > 0 ? 1.2 : 0.8, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }),

  rotate: (direction: number) => ({
    initial: { opacity: 0, rotateY: direction > 0 ? -15 : 15, perspective: 1000 },
    animate: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }),

  flip: (direction: number) => ({
    initial: {
      opacity: 0,
      rotateX: direction > 0 ? -15 : 15,
      perspective: 1000,
      y: direction > 0 ? 50 : -50,
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      rotateX: direction > 0 ? 15 : -15,
      y: direction > 0 ? -50 : 50,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }),

  // Content fade-in variants with staggered children
  content: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  },

  // Item variants for staggered animations
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },

  // Button hover animation
  button: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  },
}

// Transition component for wrapping content
export function TransitionEffect({ children, className = "", direction = 1, type = "flip" }) {
  const getVariant = () => {
    switch (type) {
      case "fade":
        return pageTransitions.fadeIn
      case "slideUp":
        return pageTransitions.slideUp
      case "slideRight":
        return pageTransitions.slideRight(direction)
      case "scale":
        return pageTransitions.scale(direction)
      case "rotate":
        return pageTransitions.rotate(direction)
      case "flip":
        return pageTransitions.flip(direction)
      default:
        return pageTransitions.flip(direction)
    }
  }

  return (
    <motion.div className={className} initial="initial" animate="animate" exit="exit" variants={getVariant()}>
      {children}
    </motion.div>
  )
}
