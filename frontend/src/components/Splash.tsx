import { motion } from 'framer-motion'
import hgPin from '../assets/hg-pin.png'

interface SplashProps {
  onComplete: () => void
}

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={onComplete}
    >
      {/* Black background — fades early so hero is visible during pin flight */}
      <motion.div
        className="absolute inset-0 bg-[#080400]"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 1.8, times: [0, 0.3, 1], ease: 'easeInOut' }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(200,80,0,0.3), rgba(255,140,0,0.1), transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.6, ease: 'easeOut', opacity: { times: [0, 0.3, 0.5] } }}
      />

      {/* Small pin — flies to big pin position, then fades */}
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
        }}
        animate={{
          left: ['50%', '50%', '50%', '90%'],
          top: ['50%', '50%', '50%', '35%'],
          x: '-50%',
          y: '-50%',
          scale: [0, 1.2, 1, 8],
          rotate: [-180, 10, 0, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.4,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.25, 0.45, 1],
        }}
      />

      {/* Ring burst */}
      <motion.div
        className="absolute rounded-full border border-[#ffd86a]/30"
        style={{ width: 200, height: 200, left: '50%', top: '50%', x: '-50%', y: '-50%' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 2.5], opacity: [0.5, 0] }}
        transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
