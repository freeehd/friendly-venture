"use client"

import { useState } from "react"
import Image from "next/image"

const ParallaxColleagues = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadedImages, setLoadedImages] = useState(0)

  const handleImageLoad = () => {
    setLoadedImages((prev) => {
      const newCount = prev + 1
      if (newCount >= 3) {
        // We have 3 images
        setImagesLoaded(true)
      }
      return newCount
    })
  }

  return (
    <div className="relative w-full h-full">
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-skeleton w-full h-full rounded-lg"></div>
        </div>
      )}
      <div className="absolute inset-0">
        <Image
          src="/images/colleagues-back.png"
          alt="Colleagues Background"
          fill
          className={`object-contain transition-opacity duration-500 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          onLoad={handleImageLoad}
        />
      </div>

      <div className="absolute inset-0">
        <Image
          src="/images/colleagues-middle.png"
          alt="Colleagues Middle"
          fill
          className={`object-contain transition-opacity duration-500 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          onLoad={handleImageLoad}
        />
      </div>

      <div className="absolute inset-0">
        <Image
          src="/images/colleagues-front.png"
          alt="Colleagues Front"
          fill
          className={`object-contain transition-opacity duration-500 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  )
}

export default ParallaxColleagues
