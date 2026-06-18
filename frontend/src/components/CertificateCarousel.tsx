import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Certificate {
  id: number;
  image?: string;
  title: string;
  description: string;
  issuer?: string;
  date?: string;
}

interface CertificateCarouselProps {
  certificates: Certificate[];
}

const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates: inputCertificates }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const MIN_ITEMS = 8;
  const certificates = [...inputCertificates];
  
  if (certificates.length < MIN_ITEMS) {
    const remaining = MIN_ITEMS - certificates.length;
    for (let i = 0; i < remaining; i++) {
      certificates.push({
        id: -1 - i,
        title: "Coming Soon",
        issuer: "Future Milestone",
        date: "2024",
        description: "Continually learning and expanding my expertise. New certifications will be showcased here as they are earned.",
      });
    }
  }

  const quantity = certificates.length;
  const selectedCert = certificates.find(c => c.id === selectedId);

  return (
    <div 
      className="relative w-full min-h-[600px] flex items-center justify-center overflow-visible px-4 md:px-10 cursor-default"
      onClick={() => setSelectedId(null)}
    >
      {/* Dynamic Glow following the selected card */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute left-1/2 top-1/2 -translate-x-[75%] -translate-y-1/2 w-[450px] h-[450px] bg-[#ffd86a]/10 rounded-full blur-[120px] z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className={`relative z-20 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] w-full ${selectedId ? 'md:translate-x-[-8%]' : ''}`}>
        
        {/* Carousel Section */}
        <div 
          className="relative w-[300px] h-[420px] flex items-center justify-center transform-style-3d transition-all duration-700"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`relative w-[220px] h-[310px] transform-style-3d ${!selectedId ? 'animate-carousel-rotate' : ''} transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]`}
            style={{
              ['--quantity' as any]: quantity,
              ['--w' as any]: '220px',
              ['--h' as any]: '310px',
              ['--translateZ' as any]: selectedId ? '0px' : '380px',
              animationPlayState: (isHovered || selectedId) ? 'paused' : 'running',
              animationDuration: '40s',
              transform: selectedId ? 'rotateY(0deg) rotateX(8deg)' : undefined,
            }}
          >
            {certificates.map((cert, index) => {
              const isSelected = selectedId === cert.id;
              const isAnySelected = selectedId !== null;
              const isPlaceholder = cert.id < 0;
              
              return (
                <div
                  key={cert.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(isSelected ? null : cert.id);
                  }}
                  className={`absolute inset-0 rounded-2xl overflow-hidden border-2 transition-all duration-700 cursor-pointer group
                    ${isSelected 
                      ? 'border-[#ffd86a] shadow-[0_0_60px_rgba(255,216,106,0.4)] z-50 scale-125' 
                      : `border-[#ffd86a]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,216,106,0.1)] hover:border-[#ffd86a]/80 hover:shadow-[0_0_50px_rgba(255,216,106,0.3)] hover:scale-110 ${isPlaceholder ? 'opacity-40 hover:opacity-100' : ''}`
                    }
                    ${isAnySelected && !isSelected ? 'opacity-0 pointer-events-none scale-90 translate-y-10' : ''}
                  `}
                  style={{
                    ['--index' as any]: index,
                    transform: isSelected 
                      ? 'translateZ(180px) translateY(-10px)' 
                      : `rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ))`,
                    background: cert.image 
                      ? 'black' 
                      : 'radial-gradient(circle at center, rgba(255,216,106,0.15) 0%, rgba(200,80,0,0.1) 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-black/60 z-[-1]" />
                  {cert.image ? (
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${isSelected ? 'grayscale-0 scale-105' : 'grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center bg-black/40">
                       <span className="text-[#ffd86a]/50 text-[10px] font-bold uppercase tracking-[0.4em]">{cert.title}</span>
                    </div>
                  )}
                  
                  {/* Subtle Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-40 pointer-events-none" />
                  
                  {/* Shimmer on Hover */}
                  <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden z-10">
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-20 -translate-x-full animate-[cert-shimmer_2.5s_infinite]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Details Section */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col w-full max-w-md relative"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-4 text-[#ffd86a]/60 text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                <span>{selectedCert.issuer || "Certification"}</span>
                <span className="w-1 h-1 rounded-full bg-[#ffd86a]/30" />
                <span>{selectedCert.date}</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold text-[#ffd86a] mb-8 leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(255,216,106,0.2)]"
              >
                {selectedCert.title}
              </motion.h2>

              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40px' }}
                transition={{ delay: 0.4, duration: 1 }}
                className="h-[1px] bg-[#ffd86a]/50 mb-8"
              />

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-lg leading-relaxed font-light italic"
              >
                "{selectedCert.description}"
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex items-center gap-3 text-[#ffd86a] text-[9px] uppercase tracking-[0.5em] font-bold"
              >
                <div className="w-8 h-[1px] bg-[#ffd86a]/20" />
                Click anywhere to dismiss
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Dynamic Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ffd86a]/5 rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000 ${selectedId ? 'opacity-30' : 'opacity-100'}`} />
    </div>
  );
};

export default CertificateCarousel;
