"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MemorialImageCarouselProps {
  images: string[]
  interval?: number
}

export function MemorialImageCarousel({ images, interval = 3000 }: MemorialImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Don't auto-rotate if only one image
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((current) => (current + 1) % images.length)
        setIsTransitioning(false)
      }, 300) // Fade duration
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  // If only one image, render it without transitions
  if (images.length === 1) {
    return (
      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
        <Image
          src={images[0]}
          alt="Memorial photo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
      {/* Current Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={images[currentIndex]}
          alt="Memorial photo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 300)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex((current) => (current - 1 + images.length) % images.length)
                setIsTransitioning(false)
              }, 300)
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex((current) => (current + 1) % images.length)
                setIsTransitioning(false)
              }, 300)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}