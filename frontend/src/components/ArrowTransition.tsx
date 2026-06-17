import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import f001 from '../assets/katniss/001.webp'
import f002 from '../assets/katniss/002.webp'
import f003 from '../assets/katniss/003.webp'
import f004 from '../assets/katniss/004.webp'
import f005 from '../assets/katniss/005.webp'
import f006 from '../assets/katniss/006.webp'
import f007 from '../assets/katniss/007.webp'
import f008 from '../assets/katniss/008.webp'
import f009 from '../assets/katniss/009.webp'
import f010 from '../assets/katniss/010.webp'
import f011 from '../assets/katniss/011.webp'
import f012 from '../assets/katniss/012.webp'
import f013 from '../assets/katniss/013.webp'
import f014 from '../assets/katniss/014.webp'
import f015 from '../assets/katniss/015.webp'

const FRAME_SOURCES = [
  f001, f002, f003, f004, f005, f006, f007, f008, f009, f010,
  f011, f012, f013, f014, f015,
]

interface ArrowTransitionProps {
  currentFrameValue: any // MotionValue<number>
}

export default function ArrowTransition({ currentFrameValue }: ArrowTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Interactive parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 })

  // Preload frames
  useEffect(() => {
    let loadedCount = 0
    const loadedImages: HTMLImageElement[] = []
    FRAME_SOURCES.forEach((src, index) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedCount++
        if (loadedCount === FRAME_SOURCES.length) setIsLoaded(true)
      }
      loadedImages[index] = img
    })
    setImages(loadedImages)
  }, [])

  // High-performance Direct Canvas Drawing
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const unsubscribe = currentFrameValue.on("change", (latest: number) => {
      const clamped = Math.max(0, Math.min(latest, 14))
      const frameIdx = Math.floor(clamped)
      const subFrame = clamped % 1
      const nextFrameIdx = Math.min(frameIdx + 1, 14)

      // Entrance: -25 to 0 -> 0 to 1 (visible early during hero scroll)
      const entrance = Math.max(0, Math.min(1, (latest + 25) / 25))
      // Exit: 20 to 25 -> 1 to 0 (dissolve only when About1 fills the screen)
      const exit = Math.max(0, Math.min(1, 1 - (latest - 20) / 5))
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (entrance <= 0 || exit <= 0) return

      // Optimized Blending
      ctx.globalAlpha = entrance * exit
      if (subFrame < 0.05) {
        ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height)
      } else {
        ctx.globalAlpha = (1 - subFrame) * entrance * exit
        ctx.drawImage(images[frameIdx], 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = subFrame * entrance * exit
        ctx.drawImage(images[nextFrameIdx], 0, 0, canvas.width, canvas.height)
      }

      // Update external container visuals
      if (containerRef.current) {
        const approachScale = 0.5 + entrance * 0.55
        const flyPastScale = 1 + (1 - exit) * 2.5
        const totalScale = approachScale * flyPastScale
        
        const blur = (1 - entrance) * 10 + (1 - exit) * 15
        containerRef.current.style.transform = `scale(${totalScale}) translate(${springX.get()}px, ${springY.get()}px)`
        containerRef.current.style.filter = `blur(${blur}px)`
      }
    })

    return () => unsubscribe()
  }, [isLoaded, images, springX, springY, currentFrameValue])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mouse move for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 40)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 40)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ 
        zIndex: useTransform(currentFrameValue, [-10, 0, 1, 19], [19, 19, 90, 90]),
        opacity: useTransform(currentFrameValue, [22, 25], [1, 0])
      }}
    >
      {/* 
          REMOVED: The solid bg-layer here was causing the 'cut-off' look. 
          The background is now managed globally in App.tsx to ensure a seamless blend.
      */}

      {/* Materializing Aura - Transparent additive bloom */}
      <motion.div 
        className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,50,0.3) 0%, rgba(200,80,0,0.08) 40%, transparent 70%)',
          opacity: useTransform(currentFrameValue, [-25, 0, 20, 25], [0, 1, 1, 0]),
          scale: useTransform(currentFrameValue, [-25, 0], [0.4, 1.4]),
          filter: 'blur(100px)',
          mixBlendMode: 'screen' // Additive blending prevents hard edges
        }}
      />

      {/* Optimized Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(255,140,0,0.3)]"
        />
      </div>

      {/* Cinematic Vignette - Global depth */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]"
        style={{ opacity: useTransform(currentFrameValue, [-25, 0, 20, 25], [0, 1, 1, 0]) }}
      />
    </motion.div>
  )
}
