"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useMobileDetect from "@/hooks/use-mobile"

export default function SpaceObjects() {
  const isMobile = useMobileDetect()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [parallaxObjects, setParallaxObjects] = useState<any[]>([])

  useEffect(() => {
    // Create space objects
    const objects = [
      {
        type: "moon",
        position: { x: 85, y: 15 },
        size: isMobile ? 60 : 100,
        depth: 0.02,
        rotation: 0,
      },
      {
        type: "planet",
        position: { x: 10, y: 70 },
        size: isMobile ? 40 : 70,
        depth: 0.03,
        rotation: 0,
      },
      {
        type: "comet",
        position: { x: 70, y: 40 },
        size: isMobile ? 30 : 50,
        depth: 0.05,
        rotation: -30,
      },
    ]

    setParallaxObjects(objects)

    // Handle mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {parallaxObjects.map((object, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${object.position.x}%`,
            top: `${object.position.y}%`,
            width: object.size,
            height: object.size,
          }}
          animate={{
            x: mousePosition.x * object.depth * -1000,
            y: mousePosition.y * object.depth * -1000,
            rotate: object.rotation,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
            mass: 0.5,
          }}
        >
          {object.type === "moon" && (
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-lg">
              <div className="absolute inset-0 rounded-full opacity-80 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_70%)]"></div>
                <div className="absolute w-[20%] h-[20%] rounded-full bg-gray-700 opacity-70 top-[15%] left-[25%]"></div>
                <div className="absolute w-[15%] h-[15%] rounded-full bg-gray-700 opacity-70 top-[45%] left-[65%]"></div>
                <div className="absolute w-[10%] h-[10%] rounded-full bg-gray-700 opacity-70 top-[65%] left-[35%]"></div>
              </div>
            </div>
          )}

          {object.type === "planet" && (
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-900 to-blue-700 shadow-lg overflow-hidden">
              <div className="absolute inset-0 rounded-full opacity-90">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]"></div>
                <div className="absolute w-full h-[8%] bg-indigo-800 opacity-70 top-[20%]"></div>
                <div className="absolute w-full h-[6%] bg-indigo-900 opacity-70 top-[40%]"></div>
                <div className="absolute w-full h-[10%] bg-indigo-800 opacity-70 top-[70%]"></div>
              </div>
            </div>
          )}

          {object.type === "comet" && (
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-200 to-blue-400 shadow-lg"></div>
              <div className="absolute top-[20%] left-[30%] w-full h-[20%] bg-gradient-to-r from-blue-300 via-blue-200 to-transparent transform -rotate-45"></div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
