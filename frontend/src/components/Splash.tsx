import { motion } from 'framer-motion'
import hgPin from '../assets/hg-pin.png'

interface SplashProps {
  onComplete: () => void
}

const embers = Array.from({ length: 24 }, () => ({
  left: 30 + Math.random() * 40,
  delay: 0.6 + Math.random() * 1.4,
  duration: 1.8 + Math.random() * 1.2,
  size: 2 + Math.random() * 3,
  drift: (Math.random() - 0.5) * 60,
}))

const sparks = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * 360,
  delay: 2.0 + Math.random() * 0.3,
  distance: 80 + Math.random() * 120,
  size: 1.5 + Math.random() * 2,
}))

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={onComplete}
    >
      {/* Black background */}
      <motion.div
        className="absolute inset-0 bg-[#080400]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 1, 0] }}
        transition={{ duration: 3.2, times: [0, 0.75, 0.88, 1], ease: 'easeInOut' }}
      />

      {/* ── Phase 1: Central spark ignition ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, #fff 0%, #ffd86a 40%, #ff8c00 70%, transparent 100%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0, 1, 3, 0],
          opacity: [0, 0, 1, 0.8, 0],
        }}
        transition={{ duration: 1.2, times: [0, 0.1, 0.25, 0.6, 1], ease: 'easeOut' }}
      />

      {/* ── Phase 1-2: Fire ring expansion ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          border: '2px solid rgba(255,216,106,0.6)',
          boxShadow: '0 0 30px rgba(255,140,0,0.4), inset 0 0 20px rgba(255,140,0,0.2)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.5, 4],
          opacity: [0, 0.9, 0],
          borderWidth: ['2px', '3px', '1px'],
        }}
        transition={{ duration: 1.0, delay: 0.3, ease: 'easeOut' }}
      />

      {/* Second fire ring — delayed */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          border: '1.5px solid rgba(255,180,50,0.5)',
          boxShadow: '0 0 20px rgba(255,140,0,0.3)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 2, 5],
          opacity: [0, 0.7, 0],
        }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
      />

      {/* ── Phase 2: Fire glow build-up ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.5) 0%, rgba(200,60,0,0.3) 30%, rgba(100,20,0,0.1) 60%, transparent 80%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0.5, 1.2, 1.0],
          opacity: [0, 0.3, 0.8, 0],
        }}
        transition={{ duration: 2.0, delay: 0.4, ease: 'easeOut' }}
      />

      {/* Inner bright fire core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(255,220,100,0.6) 0%, rgba(255,160,0,0.3) 40%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 0.8, 1.5],
          opacity: [0, 0.9, 0],
        }}
        transition={{ duration: 1.6, delay: 0.6, ease: 'easeOut' }}
      />

      {/* ── Phase 2-3: Pin appears from flames ── */}
      <motion.img
        src={hgPin}
        alt=""
        className="absolute z-10"
        style={{ width: 100, height: 100, objectFit: 'contain' }}
        initial={{
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          scale: 0,
          rotate: -180,
          opacity: 0,
          filter: 'brightness(2) saturate(1.5)',
        }}
        animate={{
          left: ['50%', '50%', '50%', '90%'],
          top: ['50%', '50%', '50%', '35%'],
          x: '-50%',
          y: '-50%',
          scale: [0, 0.3, 1.2, 1, 7],
          rotate: [-180, -20, 10, 0, 0],
          opacity: [0, 0, 1, 1, 0],
          filter: [
            'brightness(2) saturate(1.5)',
            'brightness(1.8) saturate(1.3)',
            'brightness(1.2) saturate(1.1)',
            'brightness(1) saturate(1)',
            'brightness(1) saturate(1)',
          ],
        }}
        transition={{
          duration: 3.0,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.15, 0.4, 0.65, 1],
        }}
      />

      {/* ── Phase 3: Fire trail behind pin during flight ── */}
      <motion.div
        className="absolute z-5"
        style={{
          width: 120,
          height: 60,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(ellipse, rgba(255,160,0,0.5) 0%, rgba(255,100,0,0.2) 50%, transparent 80%)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          left: ['50%', '50%', '50%', '88%'],
          top: ['50%', '50%', '50%', '34%'],
          opacity: [0, 0, 0.7, 0],
          scale: [0, 0.5, 1.2, 0.3],
        }}
        transition={{
          duration: 3.0,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.15, 0.65, 1],
        }}
      />

      {/* ── Phase 4: Landing burst rings ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 100,
          height: 100,
          right: '10%',
          top: '35%',
          x: '50%',
          y: '-50%',
          border: '1.5px solid rgba(255,216,106,0.4)',
          boxShadow: '0 0 40px rgba(255,160,0,0.3)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 2.5, 4],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 1.0, delay: 2.1, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          right: '10%',
          top: '35%',
          x: '50%',
          y: '-50%',
          border: '1px solid rgba(255,180,50,0.3)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 3, 5],
          opacity: [0, 0.6, 0],
        }}
        transition={{ duration: 1.2, delay: 2.2, ease: 'easeOut' }}
      />

      {/* Landing flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          right: '5%',
          top: '30%',
          x: '50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(255,220,100,0.6) 0%, rgba(255,160,0,0.2) 40%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.5, 2.5],
          opacity: [0, 0.9, 0],
        }}
        transition={{ duration: 0.8, delay: 2.1, ease: 'easeOut' }}
      />

      {/* ── Rising embers ── */}
      {embers.map((e, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${e.left}%`,
            bottom: '-10px',
            width: e.size,
            height: e.size,
            background: i % 3 === 0 ? '#ffd86a' : i % 3 === 1 ? '#ff8c00' : '#ff5500',
            boxShadow: `0 0 ${e.size * 3}px rgba(255,160,0,0.6)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 0.9, 0.6, 0],
            y: [0, -window.innerHeight * 0.5, -window.innerHeight * 0.8],
            x: [0, e.drift * 0.5, e.drift],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── Burst sparks on landing ── */}
      {sparks.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              right: '10%',
              top: '35%',
              width: s.size,
              height: s.size,
              background: '#ffd86a',
              boxShadow: `0 0 ${s.size * 4}px rgba(255,216,106,0.8)`,
            }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, Math.cos(rad) * s.distance],
              y: [0, Math.sin(rad) * s.distance],
              scale: [1, 0.3],
            }}
            transition={{
              duration: 0.8,
              delay: s.delay,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* ── Bottom fire glow that rises ── */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(200,60,0,0.4) 0%, rgba(255,140,0,0.15) 40%, transparent 100%)',
          filter: 'blur(20px)',
        }}
        initial={{ opacity: 0, y: '100%' }}
        animate={{
          opacity: [0, 0.8, 0.6, 0],
          y: ['100%', '0%', '-20%', '-50%'],
        }}
        transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
      />

      {/* ── Screen-wide warm tint ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.08) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2.5, delay: 0.5, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
