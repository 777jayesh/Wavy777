"use client"

import { useEffect } from "react"

export default function PhotoFix() {
  useEffect(() => {
    // Fix for photo-2 to ensure faces are visible
    const fixPhoto = () => {
      const photoElements = document.querySelectorAll('img[src*="memory-2.jpg"]')

      photoElements.forEach((photo) => {
        const img = photo as HTMLImageElement
        img.style.objectFit = "contain"
        img.style.objectPosition = "center center"

        // For thumbnails, maintain aspect ratio but ensure faces are visible
        if (img.parentElement?.classList.contains("aspect-square")) {
          img.style.objectFit = "cover"
          img.style.objectPosition = "center 30%"
        }
      })
    }

    // Run immediately and also after a short delay to catch dynamically loaded images
    fixPhoto()
    setTimeout(fixPhoto, 1000)

    // Also run when images load
    window.addEventListener("load", fixPhoto)

    return () => {
      window.removeEventListener("load", fixPhoto)
    }
  }, [])

  return null
}
