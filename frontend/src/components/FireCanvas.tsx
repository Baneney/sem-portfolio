import { useEffect, useRef } from 'react'

export default function FireCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Ember = {
      x: number; y: number
      vx: number; vy: number
      life: number; maxLife: number
      size: number
    }

    const embers: Ember[] = []

    // pre-seed so canvas isn't empty on first render
    for (let i = 0; i < 20; i++) {
      const maxLife = 180 + Math.random() * 200
      embers.push({
        x: Math.random() * canvas.width * 0.5,
        y: canvas.height - Math.random() * canvas.height * 0.8,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 1.4),
        life: Math.random() * maxLife,
        maxLife,
        size: 1 + Math.random() * 2,
      })
    }

    function spawnEmber() {
      const maxLife = 180 + Math.random() * 200
      embers.push({
        x: Math.random() * canvas!.width * 0.5,
        y: canvas!.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 1.4),
        life: 0,
        maxLife,
        size: 1 + Math.random() * 2,
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      const baseGlow = ctx!.createRadialGradient(
        canvas!.width * 0.25, canvas!.height * 1.1, 0,
        canvas!.width * 0.25, canvas!.height * 0.8, canvas!.width * 0.55
      )
      baseGlow.addColorStop(0,   'rgba(255, 160, 0, 0.45)')
      baseGlow.addColorStop(0.3, 'rgba(220, 80,  0, 0.25)')
      baseGlow.addColorStop(0.7, 'rgba(100, 20,  0, 0.10)')
      baseGlow.addColorStop(1,   'rgba(0,   0,   0, 0)')
      ctx!.fillStyle = baseGlow
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      if (Math.random() < 0.4) spawnEmber()

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life++
        e.x += e.vx + Math.sin(e.life * 0.04) * 0.5
        e.y += e.vy

        const t     = e.life / e.maxLife
        const alpha = Math.pow(1 - t, 2) * Math.min(t * 6, 1)

        if (alpha <= 0 || e.life >= e.maxLife) {
          embers.splice(i, 1)
          continue
        }

        const g = ctx!.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 5)
        g.addColorStop(0,   `rgba(255, 160, 20, ${alpha * 0.45})`)
        g.addColorStop(0.3, `rgba(220, 80,  0,  ${alpha * 0.25})`)
        g.addColorStop(1,   'rgba(0,0,0,0)')
        ctx!.beginPath()
        ctx!.arc(e.x, e.y, e.size * 5, 0, Math.PI * 2)
        ctx!.fillStyle = g
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 230, 150, ${alpha * 0.55})`
        ctx!.fill()
      }
    }

    let raf: number
    const loop = () => { draw(); raf = requestAnimationFrame(loop) }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
