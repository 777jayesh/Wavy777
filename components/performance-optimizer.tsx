"use client"

import { useEffect } from "react"

// This component helps optimize performance by applying various browser optimizations
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Request idle callback for non-critical operations
    if ("requestIdleCallback" in window) {
      // Preload critical resources during idle time
      window.requestIdleCallback(() => {
        // Preload audio files
        const audioFiles = ["/assets/birthday-music.mp3"]

        audioFiles.forEach((src) => {
          const link = document.createElement("link")
          link.rel = "preload"
          link.as = "audio"
          link.href = src
          document.head.appendChild(link)
        })

        // Preload video files
        const videoSources = [
          "/videos/memory-1.mp4",
          "/videos/memory-2.mp4",
          "/videos/memory-3.mp4",
          "/videos/memory-4.mp4",
          "/videos/memory-5.mp4",
          "/videos/memory-6.mp4",
          "/videos/memory-7.mp4",
        ]

        videoSources.forEach((src) => {
          const link = document.createElement("link")
          link.rel = "preload"
          link.as = "video"
          link.href = src
          document.head.appendChild(link)
        })

        // Preload images
        const imageSources = ["/images/memory-1.jpg", "/images/memory-2.jpg", "/images/memory-3.jpg"]

        imageSources.forEach((src) => {
          const link = document.createElement("link")
          link.rel = "preload"
          link.as = "image"
          link.href = src
          document.head.appendChild(link)
        })
      })
    }

    // Optimize rendering
    const style = document.createElement("style")
    style.innerHTML = `
  * {
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    perspective: 1000;
  }
  
  .hardware-accelerated {
    transform: translate3d(0, 0, 0);
    will-change: transform, opacity;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Ensure consistent colors across devices */
  :root {
    color-scheme: dark;
    color-rendering: optimizeSpeed;
  }
  
  /* Improve text rendering */
  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* Optimize video playback */
  video {
    object-fit: cover;
    -webkit-object-fit: cover;
    will-change: transform;
    transform: translateZ(0);
  }
  
  /* Force hardware acceleration for animations */
  .animate-pulse,
  .animate-spin,
  .animate-bounce,
  .motion-safe\\:animate-pulse,
  .motion-safe\\:animate-spin,
  .motion-safe\\:animate-bounce {
    will-change: transform, opacity;
    transform: translateZ(0);
  }
  
  /* Ensure consistent color rendering */
  @media screen and (color-gamut: srgb) {
    :root {
      --color-profile: srgb;
    }
  }
  
  /* Optimize canvas rendering */
  canvas {
    will-change: transform;
    transform: translateZ(0);
  }
  
  /* Improve mobile performance */
  @media (max-width: 768px) {
    .hardware-accelerated {
      transform: translate3d(0, 0, 0);
      will-change: transform;
      backface-visibility: hidden;
    }
    
    canvas {
      image-rendering: optimizeSpeed;
    }
    
    /* Optimize images for mobile */
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Improve touch response */
    a, button {
      touch-action: manipulation;
    }
  }
  
  /* Optimize for iPhone 15 and newer devices */
  @media screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) {
    .aspect-video img,
    .aspect-video video {
      object-fit: contain !important;
      width: auto !important;
      height: auto !important;
      max-width: 100% !important;
      max-height: 100% !important;
    }
    
    /* Improve fullscreen experience */
    .fixed.inset-0 img,
    .fixed.inset-0 video {
      object-fit: contain !important;
      width: auto !important;
      height: auto !important;
      max-height: 90vh !important;
      max-width: 100% !important;
    }
  }
  
  /* Reduce layout shifts */
  img, video {
    content-visibility: auto;
  }
  
  /* Optimize animations */
  @media (min-width: 768px) {
    .motion-safe\\:animate-pulse,
    .motion-safe\\:animate-spin,
    .motion-safe\\:animate-bounce {
      animation-play-state: running;
    }
  }
  
  /* Optimize scrolling */
  html, body {
    scroll-behavior: smooth;
  }
  
  /* Reduce repaints */
  .fixed, .absolute {
    contain: layout style paint;
  }
  
  /* Optimize image rendering */
  img {
    image-rendering: auto;
  }
`
    document.head.appendChild(style)

    // Detect low-end devices and reduce animation frame rate
    const checkLowEndDevice = () => {
      const memory = (navigator as any).deviceMemory
      const connection = (navigator as any).connection
      const isLowEndDevice =
        (memory && memory <= 4) ||
        (connection &&
          (connection.saveData ||
            (connection.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType))))

      if (isLowEndDevice) {
        const lowEndStyle = document.createElement("style")
        lowEndStyle.innerHTML = `
      * {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }
      
      canvas {
        display: none !important;
      }
    `
        document.head.appendChild(lowEndStyle)
      }
    }

    if (typeof window !== "undefined") {
      try {
        checkLowEndDevice()
      } catch (e) {
        // Ignore errors if deviceMemory or connection API is not available
      }
    }

    // Add meta tags for better color rendering
    const metaColor = document.createElement("meta")
    metaColor.name = "color-scheme"
    metaColor.content = "dark"
    document.head.appendChild(metaColor)

    // Add meta for better viewport handling
    const metaViewport = document.createElement("meta")
    metaViewport.name = "viewport"
    metaViewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    document.head.appendChild(metaViewport)

    // Add theme-color meta for consistent browser UI
    const metaThemeColor = document.createElement("meta")
    metaThemeColor.name = "theme-color"
    metaThemeColor.content = "#000000"
    document.head.appendChild(metaThemeColor)

    // Optimize touch events on mobile
    document.addEventListener("touchstart", () => {}, { passive: true })
    document.addEventListener("touchmove", () => {}, { passive: true })
    document.addEventListener("wheel", () => {}, { passive: true })

    // Optimize image loading
    if ("loading" in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]')
      images.forEach((img) => {
        img.src = img.dataset.src
      })
    }

    // Use Intersection Observer to lazy load images
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute("data-src")
            }
            observer.unobserve(img)
          }
        })
      })

      // Observe all images with data-src attribute
      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img)
      })
    }

    return () => {
      document.head.removeChild(style)
      if (document.head.contains(metaColor)) document.head.removeChild(metaColor)
      if (document.head.contains(metaViewport)) document.head.removeChild(metaViewport)
      if (document.head.contains(metaThemeColor)) document.head.removeChild(metaThemeColor)
    }
  }, [])

  return null
}
