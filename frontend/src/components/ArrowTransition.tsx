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

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

interface ArrowTransitionProps {
  currentFrameValue: any // MotionValue<number>
}

export default function ArrowTransition({ currentFrameValue }: ArrowTransitionProps) {
  const frameCanvasRef = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const embersRef = useRef<Ember[]>([])
  const prevFrameRef = useRef(-1)
  const rafRef = useRef<number>(0)

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

  // Spawn fire ember burst (FireCanvas style)
  function spawnBurst(cx: number, cy: number) {
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 8
      const maxLife = 60 + Math.random() * 80
      embersRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 0,
        maxLife,
        size: 1.5 + Math.random() * 3,
      })
    }
  }

  // Unified render loop — both canvases in one rAF
  useEffect(() => {
    const frameCanvas = frameCanvasRef.current
    const particleCanvas = particleCanvasRef.current
    if (!frameCanvas || !particleCanvas) return

    const frameCtx = frameCanvas.getContext('2d', { alpha: true })
    const particleCtx = particleCanvas.getContext('2d', { alpha: true })
    if (!frameCtx || !particleCtx) return

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      frameCanvas.width = w
      frameCanvas.height = h
      particleCanvas.width = w
      particleCanvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    let lastFrameValue = -10

    const unsubscribe = currentFrameValue.on("change", (latest: number) => {
      lastFrameValue = latest
    })

    function tick() {
      if (!frameCtx || !particleCtx || !frameCanvas) return
      const w = frameCanvas.width
      const h = frameCanvas.height
      const latest = lastFrameValue

      // Trigger burst once when entering frame 14 (index 13)
      const currentFrameIdx = Math.floor(Math.max(0, Math.min(latest, 14)))
      if (currentFrameIdx === 13 && prevFrameRef.current !== 13) {
        spawnBurst(w * 0.5, h * 0.5)
      }
      prevFrameRef.current = currentFrameIdx

      // --- Frame canvas ---
      const clamped = Math.max(0, Math.min(latest, 14))
      const frameIdx = Math.floor(clamped)
      const subFrame = clamped % 1
      const nextFrameIdx = Math.min(frameIdx + 1, 14)
      const entrance = Math.max(0, Math.min(1, (latest + 25) / 25))
      const exit = Math.max(0, Math.min(1, 1 - (latest - 20) / 5))

      frameCtx.clearRect(0, 0, w, h)

      if (entrance > 0 && exit > 0 && images.length > 0) {
        frameCtx.globalAlpha = entrance * exit
        if (subFrame < 0.05) {
          frameCtx.drawImage(images[frameIdx], 0, 0, w, h)
        } else {
          frameCtx.globalAlpha = (1 - subFrame) * entrance * exit
          frameCtx.drawImage(images[frameIdx], 0, 0, w, h)
          frameCtx.globalAlpha = subFrame * entrance * exit
          frameCtx.drawImage(images[nextFrameIdx], 0, 0, w, h)
        }
        frameCtx.globalAlpha = 1
      }

      // Update container transform
      if (containerRef.current) {
        const approachScale = 0.5 + entrance * 0.55
        const flyPastScale = 1 + (1 - exit) * 2.5
        const blur = (1 - entrance) * 10 + (1 - exit) * 15
        containerRef.current.style.transform = `scale(${approachScale * flyPastScale}) translate(${springX.get()}px, ${springY.get()}px)`
        containerRef.current.style.filter = `blur(${blur}px)`
      }

      // --- Particle canvas (FireCanvas style embers) ---
      particleCtx.clearRect(0, 0, w, h)
      const embers = embersRef.current

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life++
        e.x += e.vx + Math.sin(e.life * 0.06) * 0.6
        e.y += e.vy
        e.vy -= 0.01 // slight upward drift

        const t = e.life / e.maxLife
        const alpha = Math.pow(1 - t, 2) * Math.min(t * 6, 1)

        if (alpha <= 0 || e.life >= e.maxLife) {
          embers.splice(i, 1)
          continue
        }

        // Outer glow — radial gradient (no shadowBlur, GPU-friendly)
        const glowRadius = e.size * 5
        const g = particleCtx.createRadialGradient(e.x, e.y, 0, e.x, e.y, glowRadius)
        g.addColorStop(0, `rgba(255, 160, 20, ${alpha * 0.4})`)
        g.addColorStop(0.4, `rgba(220, 80, 0, ${alpha * 0.2})`)
        g.addColorStop(1, 'rgba(0, 0, 0, 0)')
        particleCtx.beginPath()
        particleCtx.arc(e.x, e.y, glowRadius, 0, Math.PI * 2)
        particleCtx.fillStyle = g
        particleCtx.fill()

        // Core dot
        particleCtx.beginPath()
        particleCtx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        particleCtx.fillStyle = `rgba(255, 230, 150, ${alpha * 0.55})`
        particleCtx.fill()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      unsubscribe()
    }
  }, [isLoaded, images, springX, springY, currentFrameValue])

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
        opacity: useTransform(currentFrameValue, [22, 25], [1, 0]),
        backgroundColor: '#000'
      }}
    >
      {/* Fire background glows — matches Projects.tsx */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#c85000]/20 blur-[120px]" />
        <div className="absolute top-[30%] left-[-15%] w-[50%] h-[40%] rounded-full bg-[#e86000]/15 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
      </div>

      {/* Fire sparkles — scatter from fire sources */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 35 }, (_, i) => {
          const angle = (i / 35) * Math.PI * 2 + (i % 3) * 0.5
          const dist = 10 + (i % 5) * 10
          const dx = Math.cos(angle) * dist
          const dy = Math.sin(angle) * dist
          const sourceX = 10 + (i * 7) % 80
          const sourceY = 5 + (i * 11) % 90
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${sourceX}%`,
                top: `${sourceY}%`,
                width: `${2 + (i % 4) * 1.2}px`,
                height: `${2 + (i % 4) * 1.2}px`,
                background: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ffb300' : '#ff8c00',
                boxShadow: `0 0 ${6 + (i % 4) * 3}px ${i % 3 === 0 ? 'rgba(255,216,106,0.8)' : i % 3 === 1 ? 'rgba(255,179,0,0.7)' : 'rgba(255,140,0,0.6)'}`,
                opacity: 0,
                animation: `project-scatter ${2.5 + (i % 5) * 0.8}s ease-out ${i * 0.2}s infinite`,
                '--scatter-x': `${dx}vw`,
                '--scatter-y': `${dy - 8}vh`,
              } as React.CSSProperties}
            />
          )
        })}
      </div>

      {/* Particle canvas — BEHIND the assets */}
      <canvas 
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Frame canvas — Katniss assets ON TOP */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
        style={{ zIndex: 2 }}
      >
        <canvas 
          ref={frameCanvasRef}
          className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(255,140,0,0.3)]"
        />
      </div>
    </motion.div>
  )
}
