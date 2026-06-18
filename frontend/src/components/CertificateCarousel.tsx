import React from 'react';
import { motion } from 'framer-motion';

interface Certificate {
  id: number;
  image?: string;
  title: string;
}

interface CertificateCarouselProps {
  certificates: Certificate[];
}

const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates }) => {
  const quantity = certificates.length;

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-[180px] h-[250px] transform-style-3d"
        style={{
          perspective: '1000px',
        }}
      >
        <motion.div
          className="relative w-full h-full transform-style-3d"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            // CSS variables for the inner math
            ['--quantity' as any]: quantity,
            ['--w' as any]: '180px',
            ['--h' as any]: '250px',
            ['--translateZ' as any]: 'calc(var(--w) * 1.5 + 50px)', // Adjust radius
            ['--rotateX' as any]: '-10deg',
          }}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[#ffd86a]/30 backdrop-blur-sm shadow-[0_0_20px_rgba(255,216,106,0.2)]"
              style={{
                ['--index' as any]: index,
                transform: `rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ))`,
                background: cert.image 
                  ? 'none' 
                  : 'radial-gradient(circle, rgba(255,216,106,0.1) 0%, rgba(200,80,0,0.1) 80%, rgba(200,80,0,0.2) 100%)',
              }}
            >
              {cert.image ? (
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-center">
                   <span className="text-[#ffd86a]/40 text-xs font-bold uppercase tracking-widest">{cert.title}</span>
                </div>
              )}
              
              {/* Overlay Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffd86a]/10 to-transparent pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#ffd86a]/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default CertificateCarousel;
