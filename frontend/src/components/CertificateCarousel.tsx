import React, { useState } from 'react';

interface Certificate {
  id: number;
  image?: string;
  title: string;
}

interface CertificateCarouselProps {
  certificates: Certificate[];
}

const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates }) => {
  const [isHovered, setIsHovered] = useState(false);
  const quantity = certificates.length;

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-[200px] h-[280px] transform-style-3d transition-transform duration-700"
        style={{
          perspective: '1000px',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative w-full h-full transform-style-3d animate-carousel-rotate"
          style={{
            // CSS variables for the inner math
            ['--quantity' as any]: quantity,
            ['--w' as any]: '200px',
            ['--h' as any]: '280px',
            ['--translateZ' as any]: '350px',
            animationPlayState: isHovered ? 'paused' : 'running',
            animationDuration: '30s',
          }}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#ffd86a]/30 backdrop-blur-md shadow-[0_0_30px_rgba(255,216,106,0.15)] cursor-pointer transition-all duration-500 hover:border-[#ffd86a]/60 hover:shadow-[0_0_50px_rgba(255,216,106,0.3)] hover:scale-110 group"
              style={{
                ['--index' as any]: index,
                transform: `rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ))`,
                background: cert.image 
                  ? 'black' 
                  : 'radial-gradient(circle at center, rgba(255,216,106,0.15) 0%, rgba(200,80,0,0.05) 100%)',
              }}
            >
              {cert.image ? (
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
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
          ))}
        </div>
      </div>
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffd86a]/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};

export default CertificateCarousel;
