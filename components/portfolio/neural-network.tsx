"use client"

import { useEffect, useRef } from "react"
import useMobileDetect from "@/hooks/use-mobile"

export default function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobileDetect()
  const nodesRef = useRef<any[]>([])
  const connectionsRef = useRef<any[]>([])
  const animationRef = useRef<number>()
  const lastFrameTimeRef = useRef<number>(0)
  const pulseRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set canvas dimensions with high DPI support
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create neural network nodes
    const layerCount = 4
    const nodesPerLayer = isMobile ? 5 : 8
    nodesRef.current = []
    connectionsRef.current = []

    // Create nodes
    for (let layer = 0; layer < layerCount; layer++) {
      const layerNodes = []
      const layerX = (canvas.width / (layerCount + 1)) * (layer + 1)

      for (let i = 0; i < nodesPerLayer; i++) {
        const nodeY = (canvas.height / (nodesPerLayer + 1)) * (i + 1)

        layerNodes.push({
          x: layerX,
          y: nodeY,
          radius: 4,
          color: `rgba(100, 100, 255, 0.8)`,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.05 + Math.random() * 0.05,
          connections: [],
        })
      }

      nodesRef.current.push(layerNodes)
    }

    // Create connections between layers
    for (let layer = 0; layer < layerCount - 1; layer++) {
      const currentLayer = nodesRef.current[layer]
      const nextLayer = nodesRef.current[layer + 1]

      currentLayer.forEach((node) => {
        nextLayer.forEach((nextNode) => {
          connectionsRef.current.push({
            from: node,
            to: nextNode,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            signalPosition: 0,
            signalSpeed: 0.01 + Math.random() * 0.02,
            active: Math.random() > 0.5,
          })
        })
      })
    }

    // Animation loop with optimized frame rate
    const animate = (timestamp: number) => {
      // Limit to 30fps for better performance
      const elapsed = timestamp - lastFrameTimeRef.current
      if (elapsed < 33) {
        // ~30fps
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTimeRef.current = timestamp

      // Update pulse
      pulseRef.current += 0.05

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      connectionsRef.current.forEach((connection) => {
        // Update pulse
        connection.pulsePhase += connection.pulseSpeed

        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(connection.from.x, connection.from.y)
        ctx.lineTo(connection.to.x, connection.to.y)

        const opacity = 0.1 + Math.sin(connection.pulsePhase) * 0.05
        ctx.strokeStyle = `rgba(100, 100, 255, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw signal pulse if active
        if (connection.active) {
          connection.signalPosition += connection.signalSpeed

          if (connection.signalPosition > 1) {
            connection.signalPosition = 0
            connection.active = Math.random() > 0.3 // 70% chance to remain active
          }

          const signalX = connection.from.x + (connection.to.x - connection.from.x) * connection.signalPosition
          const signalY = connection.from.y + (connection.to.y - connection.from.y) * connection.signalPosition

          ctx.beginPath()
          ctx.arc(signalX, signalY, 2, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(150, 150, 255, 0.8)"
          ctx.fill()
        }
      })

      // Draw nodes
      nodesRef.current.flat().forEach((node) => {
        // Update pulse
        node.pulsePhase += node.pulseSpeed

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulsePhase) * 1, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius * 2)
        gradient.addColorStop(0, "rgba(100, 100, 255, 0.3)")
        gradient.addColorStop(1, "rgba(100, 100, 255, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isMobile])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{
        opacity: 0.6,
      }}
    />
  )
}
