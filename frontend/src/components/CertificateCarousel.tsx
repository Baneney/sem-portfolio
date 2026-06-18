import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Certificate {
  id: number;
  image?: string;
  title: string;
  description: string;
}

interface CertificateCarouselProps {
  certificates: Certificate[];
}

const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates: inputCertificates }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // To keep the carousel symmetrical, we ensure at least 8 items.
  // We fill empty slots with "Coming Soon" placeholders.
  const MIN_ITEMS = 8;
  const certificates = [...inputCertificates];
  
  if (certificates.length < MIN_ITEMS) {
    const remaining = MIN_ITEMS - certificates.length;
    for (let i = 0; i < remaining; i++) {
      certificates.push({
        id: -1 - i, // Unique negative ID for placeholders
        title: "Coming Soon",
        description: "New certifications and achievements will be added here soon. Stay tuned!",
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
      <div className={`relative z-20 flex flex-col md:flex-row items-center justify-center gap-10 transition-all duration-700 w-full ${selectedId ? 'md:translate-x-[-10%]' : ''}`}>
        
        {/* Carousel Section */}
        <div 
          className="relative w-[280px] h-[400px] flex items-center justify-center transform-style-3d transition-all duration-700"
          style={{
            perspective: '1000px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`relative w-[200px] h-[280px] transform-style-3d ${!selectedId ? 'animate-carousel-rotate' : ''} transition-transform duration-1000`}
            style={{
              ['--quantity' as any]: quantity,
              ['--w' as any]: '200px',
              ['--h' as any]: '280px',
              ['--translateZ' as any]: selectedId ? '0px' : '350px',
              animationPlayState: (isHovered || selectedId) ? 'paused' : 'running',
              animationDuration: '30s',
              transform: selectedId ? 'rotateY(0deg)' : undefined,
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
                    e.stopPropagation(); // Prevent root onClick (dismissal)
                    setSelectedId(isSelected ? null : cert.id);
                  }}
                  className={`absolute inset-0 rounded-2xl overflow-hidden border-2 transition-all duration-700 cursor-pointer group
                    ${isSelected 
                      ? 'border-[#ffd86a] shadow-[0_0_50px_rgba(255,216,106,0.4)] z-50 scale-125' 
                      : `border-[#ffd86a]/50 backdrop-blur-xl shadow-[0_0_30px_rgba(255,216,106,0.15)] hover:border-[#ffd86a]/80 hover:shadow-[0_0_50px_rgba(255,216,106,0.3)] hover:scale-110 ${isPlaceholder ? 'opacity-60 hover:opacity-100' : ''}`
                    }
                    ${isAnySelected && !isSelected ? 'opacity-0 pointer-events-none' : ''}
                  `}
                  style={{
                    ['--index' as any]: index,
                    transform: isSelected 
                      ? 'translateZ(140px)' 
                      : `rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ))`,
                    background: cert.image 
                      ? 'black' 
                      : 'radial-gradient(circle at center, rgba(255,216,106,0.25) 0%, rgba(200,80,0,0.15) 100%)',
                  }}
                >
                  {/* Base card fill to ensure it's not too transparent */}
                  <div className="absolute inset-0 bg-black/60 z-[-1]" />
                  {cert.image ? (
                    <img 
                      src={cert.image} 
                      alt={cert.title} 
                      className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'grayscale-0' : 'grayscale-[20%] group-hover:grayscale-0'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center bg-black/40">
                       <span className="text-[#ffd86a]/60 text-sm font-bold uppercase tracking-[0.2em]">{cert.title}</span>
                    </div>
                  )}
                  
                  {/* Shimmer Sweep */}
                  <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden z-10">
                    <div 
                      className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20 -translate-x-full animate-[cert-shimmer_1.5s_infinite]" 
                    />
                  </div>

                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#ffd86a]/10 via-transparent to-transparent pointer-events-none z-0" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(255,216,106,0.1)_0%,transparent_70%)] pointer-events-none z-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Section */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()} // Prevent root onClick (dismissal)
              className="flex flex-col max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-[#ffd86a]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-[#ffd86a] mb-4 tracking-tight"
              >
                {selectedCert.title}
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '60px' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-[#ffd86a] to-transparent mb-6"
              />
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 text-lg leading-relaxed mb-4"
              >
                {selectedCert.description}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[#ffd86a]/40 text-sm italic"
              >
                Click anywhere outside to go back
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Dynamic Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffd86a]/5 rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000 ${selectedId ? 'opacity-40' : 'opacity-100'}`} />
    </div>
  );
};

export default CertificateCarousel;
