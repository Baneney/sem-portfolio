import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import CertificateCarousel from '../components/CertificateCarousel'

const certificates = [
  { id: 1, title: "Certificate 1", description: "Comprehensive course on web development foundations.", image: "https://picsum.photos/400/600?random=1" },
  { id: 2, title: "Certificate 2", description: "Advanced React patterns and performance optimization.", image: "https://picsum.photos/400/600?random=2" },
  { id: 3, title: "Certificate 3", description: "TypeScript mastery for enterprise-scale applications.", image: "https://picsum.photos/400/600?random=3" },
  { id: 4, title: "Certificate 4", description: "Cloud architecture and deployment strategies.", image: "https://picsum.photos/400/600?random=4" },
  { id: 5, title: "Certificate 5", description: "UI/UX design principles and user-centric interfaces.", image: "https://picsum.photos/400/600?random=5" },
  { id: 6, title: "Certificate 6", description: "Backend development with Node.js and PostgreSQL.", image: "https://picsum.photos/400/600?random=6" },
  { id: 7, title: "Certificate 7", description: "Mobile app development with React Native.", image: "https://picsum.photos/400/600?random=7" },
  { id: 8, title: "Certificate 8", description: "Data structures and algorithms in JavaScript.", image: "https://picsum.photos/400/600?random=8" },
]

export default function Certificates({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 30 })
  
  const { scrollYProgress: exitProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  const smoothExit = useSpring(exitProgress, { stiffness: 45, damping: 25 })
  const contentOpacity = useTransform(smoothExit, [0, 0.7], [1, 0])

  return (
    <motion.section
      ref={sectionRef}
      id="certificates"
      className="section-page relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080400] py-40"
    >
      {/* Edge Gradients for seamless connection */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-[#080400] via-[#080400]/90 to-transparent z-[15] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#080400] via-[#080400]/90 to-transparent z-[15] pointer-events-none" />

      {/* Fire background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#c85000]/20 blur-[120px]" />
        <div className="absolute top-[30%] left-[-15%] w-[50%] h-[40%] rounded-full bg-[#e86000]/15 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[30%] rounded-full bg-[#ff8c00]/10 blur-[80px]" />
      </div>

      {/* Fire sparkles — scatter from fire sources across the page */}
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

      <motion.div 
        className="relative z-10 w-full flex flex-col items-center"
        style={{ opacity: contentOpacity }}
      >
        <CertificateCarousel certificates={certificates} />
      </motion.div>
    </motion.section>
  )
}
