import { useEffect, useRef } from 'react'

interface ScannerWipeProps {
  active: boolean
}

const DURATION = 1000
const LINE_HEIGHT = 3

export default function ScannerWipe({ active }: ScannerWipeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const startTimeRef = useRef(-1)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    activeRef.current = active
    if (active) startTimeRef.current = performance.now()
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw(time: number) {
      const ctx2 = ctx!
      const w = canvas!.width
      const h = canvas!.height
      ctx2.clearRect(0, 0, w, h)

      if (!activeRef.current) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const elapsed = time - startTimeRef.current
      const p = Math.min(elapsed / DURATION, 1)
      const lineY = (1 - p) * h

      const darkFade = Math.max(0, 1 - p * 1.2)
      if (darkFade > 0.01) {
        ctx2.fillStyle = `rgba(8,4,0,${darkFade * 0.85})`
        ctx2.fillRect(0, 0, w, lineY)
      }

      const glowGrad = ctx2.createLinearGradient(0, lineY - 80, 0, lineY + 80)
      glowGrad.addColorStop(0, 'rgba(0,0,0,0)')
      glowGrad.addColorStop(0.35, `rgba(200,150,50,${0.06 * darkFade})`)
      glowGrad.addColorStop(0.48, `rgba(230,180,60,${0.18 * darkFade})`)
      glowGrad.addColorStop(0.5, `rgba(255,220,100,${0.7 * darkFade})`)
      glowGrad.addColorStop(0.52, `rgba(230,180,60,${0.18 * darkFade})`)
      glowGrad.addColorStop(0.65, `rgba(200,150,50,${0.06 * darkFade})`)
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx2.fillStyle = glowGrad
      ctx2.fillRect(0, lineY - 80, w, 160)

      const coreGrad = ctx2.createLinearGradient(0, lineY - LINE_HEIGHT / 2, 0, lineY + LINE_HEIGHT / 2)
      coreGrad.addColorStop(0, 'rgba(200,160,60,0)')
      coreGrad.addColorStop(0.5, `rgba(255,220,100,${0.9 * darkFade})`)
      coreGrad.addColorStop(1, 'rgba(200,160,60,0)')
      ctx2.fillStyle = coreGrad
      ctx2.fillRect(0, lineY - LINE_HEIGHT / 2, w, LINE_HEIGHT)

      ctx2.save()
      ctx2.shadowColor = `rgba(255,180,50,${0.8 * darkFade})`
      ctx2.shadowBlur = 25
      ctx2.fillStyle = `rgba(255,210,80,${0.4 * darkFade})`
      ctx2.fillRect(0, lineY - 1, w, 2)
      ctx2.restore()

      if (p < 1) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fire-wipe-canvas"
    />
  )
}
