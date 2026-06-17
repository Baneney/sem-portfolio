import { useMemo, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

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

const FRAMES = [
  f001, f002, f003, f004, f005, f006, f007, f008, f009, f010,
  f011, f012, f013, f014, f015
]

interface KatnissTransitionProps {
  currentFrame: number // This is now a float (e.g. 10.4)
}

export default function KatnissTransition({ currentFrame }: KatnissTransitionProps) {
  const baseFrame = Math.max(0, Math.min(currentFrame, 29))
  
  // Timing states
  const isPeak = baseFrame >= 8 && baseFrame <= 22

  // Interactive parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 })

  // Subtle cinematic zoom based on the float frame
  const scale = useMemo(() => 1.05 + (baseFrame / 29) * 0.1, [baseFrame])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 40
      const y = (clientY / innerHeight - 0.5) * 40
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Overall container opacity (fade in/out of the whole sequence)
  const containerOpacity = useMemo(() => {
    if (baseFrame < 2) return (baseFrame + 0.5) / 2.5
    if (baseFrame > 27) return 1 - (baseFrame - 27) / 2.5
    return 1
  }, [baseFrame])

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: containerOpacity }}
      exit={{ opacity: 0 }}
    >
      {/* ── Cinematic Background Layer ── */}
      <motion.div 
        className="absolute inset-0 bg-[#080502]"
        style={{ opacity: containerOpacity }}
      />

      {/* ── Cinematic Atmosphere ── */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full"
          animate={{
            opacity: isPeak ? 0.4 : 0.2,
            scale: isPeak ? 1.1 : 1,
          }}
          style={{
            background: 'radial-gradient(circle, rgba(255,100,0,0.25) 0%, rgba(200,50,0,0.08) 40%, transparent 70%)',
            filter: 'blur(100px)',
            x: springX,
            y: springY,
          }}
        />
        {/* Subtle Heat Distortion Layer */}
        {isPeak && (
          <motion.div 
            className="absolute inset-0 bg-orange-500/5 mix-blend-overlay opacity-30"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          />
        )}
      </div>

      {/* ── Image Stack for Zero-Flicker Cross-fading ── */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          scale,
        }}
      >
        {FRAMES.map((src, index) => {
          // Calculate opacity for this specific frame based on how close it is to currentFrame
          // This creates the buttery-smooth 'cross-fade' between frames
          const diff = Math.abs(index - baseFrame)
          let frameOpacity = 0
          if (diff < 1) {
            frameOpacity = 1 - diff
          }

          // Optimization: don't even render if opacity is 0, 
          // but we render 'near' frames to ensure they are ready
          if (frameOpacity <= 0 && Math.abs(index - baseFrame) > 2) return null

          return (
            <img
              key={index}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ 
                opacity: frameOpacity,
                // Using transition: opacity to smooth out very fast scrolls
                transition: 'opacity 0.05s linear',
                filter: isPeak ? 'brightness(1.1) contrast(1.1)' : 'none',
              }}
              draggable={false}
            />
          )
        })}
      </motion.div>

      {/* ── Cinematic Overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,6,2,0.3) 60%, rgba(8,4,0,0.9) 100%)',
        }}
      />

      <div className="absolute top-10 left-10 text-[#ffd86a]/15 text-[9px] tracking-[1.2em] uppercase z-40 font-mono">
        System_Ref_MJ_030
      </div>
      <div className="absolute bottom-10 right-10 text-[#ffd86a]/15 text-[9px] tracking-[1.2em] uppercase z-40 font-mono">
        F_{String(Math.floor(baseFrame)).padStart(2, '0')} // BUFF_READY
      </div>
    </motion.div>
  )
}
