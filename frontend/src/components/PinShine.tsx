import { useEffect, useRef } from 'react'

export default function PinShine({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = src

    img.onload = () => {
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight

      let progress = 0
      let raf: number

      function draw() {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

        ctx!.drawImage(img, 0, 0, canvas!.width, canvas!.height)

        ctx!.globalCompositeOperation = 'source-atop'

        const x = (progress - 0.2) * canvas!.width * 1.4
        const w = canvas!.width * 0.35

        const grad = ctx!.createLinearGradient(x, 0, x + w, 0)
        grad.addColorStop(0,   'rgba(255,240,180,0)')
        grad.addColorStop(0.4, 'rgba(255,240,180,0.25)')
        grad.addColorStop(0.5, 'rgba(255,255,255,0.55)')
        grad.addColorStop(0.6, 'rgba(255,240,180,0.25)')
        grad.addColorStop(1,   'rgba(255,240,180,0)')

        ctx!.save()
        ctx!.translate(canvas!.width / 2, canvas!.height / 2)
        ctx!.rotate(25 * Math.PI / 180)
        ctx!.translate(-canvas!.width / 2, -canvas!.height / 2)
        ctx!.fillStyle = grad
        ctx!.fillRect(x, -canvas!.height, w, canvas!.height * 3)
        ctx!.restore()

        ctx!.globalCompositeOperation = 'source-over'

        progress += 0.004
        if (progress > 1.2) progress = 0

        raf = requestAnimationFrame(draw)
      }

      draw()
      return () => cancelAnimationFrame(raf)
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-auto object-contain opacity-90"
    />
  )
}
