import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const MIN_ITEMS = 8;

const CertificateCarousel: React.FC<CertificateCarouselProps> = ({ certificates: inputCertificates }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
  const anglePerItem = 360 / quantity;

  const isAnySelected = selectedId !== null;

  const carouselRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);
  const velRef = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const rafRef = useRef(0);
  const snapTarget = useRef<number | null>(null);
  const pressedCardIdx = useRef<number | null>(null);

  const SPIN_FACTOR = 0.4;
  const FRICTION = 0.96;
  const AUTO_SPEED = 9 / 1000;
  const SNAP_SPEED = 0.08;

  const applyRot = useCallback((rot: number) => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `rotateX(-10deg) rotateY(${rot}deg)`;
    }
  }, []);

  useEffect(() => {
    let prev = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - prev, 50);
      prev = now;

      if (!dragging.current) {
        if (snapTarget.current !== null) {
          const diff = snapTarget.current - rotRef.current;
          if (Math.abs(diff) < 0.3) {
            rotRef.current = snapTarget.current;
            snapTarget.current = null;
            velRef.current = 0;
          } else {
            rotRef.current += diff * SNAP_SPEED * (dt / 16);
          }
        } else if (Math.abs(velRef.current) > 0.05) {
          rotRef.current += velRef.current * (dt / 16);
          velRef.current *= Math.pow(FRICTION, dt / 16);
        } else {
          velRef.current = 0;
          if (!isAnySelected && !isHovered) {
            rotRef.current += AUTO_SPEED * dt;
          }
        }
      }

      applyRot(rotRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyRot, isAnySelected, isHovered]);

  const snapTo = useCallback((index: number) => {
    const target = index * anglePerItem;
    const current = rotRef.current;
    const norm = ((current % 360) + 360) % 360;
    const diff = target - norm;
    let adjust = diff;
    if (adjust > 180) adjust -= 360;
    if (adjust < -180) adjust += 360;
    snapTarget.current = current + adjust;
    velRef.current = 0;
    dragging.current = false;
  }, [anglePerItem]);

  const onDown = useCallback((clientX: number) => {
    dragging.current = true;
    dragStartX.current = clientX;
    dragStartRot.current = rotRef.current;
    lastX.current = clientX;
    lastT.current = performance.now();
    velRef.current = 0;
    snapTarget.current = null;
  }, []);

  const onMove = useCallback((clientX: number) => {
    if (!dragging.current) return;
    const dx = clientX - dragStartX.current;
    rotRef.current = dragStartRot.current + dx * SPIN_FACTOR;

    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) {
      const instVel = ((clientX - lastX.current) * SPIN_FACTOR) / dt * 16;
      velRef.current = velRef.current * 0.6 + instVel * 0.4;
    }
    lastX.current = clientX;
    lastT.current = now;
  }, []);

  const onUp = useCallback((clientX: number) => {
    if (!dragging.current) return;
    dragging.current = false;

    const totalMoved = Math.abs(clientX - dragStartX.current);

    if (totalMoved < 5 && pressedCardIdx.current !== null) {
      const idx = pressedCardIdx.current;
      const cert = certificates[idx];
      if (cert && cert.id >= 0) {
        setSelectedId(prev => prev === cert.id ? null : cert.id);
        snapTo(idx);
      }
      pressedCardIdx.current = null;
      return;
    }

    pressedCardIdx.current = null;

    if (Math.abs(velRef.current) > 0.3) {
      const check = () => {
        if (!dragging.current && Math.abs(velRef.current) < 0.3) {
          const nearest = Math.round(rotRef.current / anglePerItem) * anglePerItem;
          snapTarget.current = nearest;
        } else if (!dragging.current) {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
    } else {
      const nearest = Math.round(rotRef.current / anglePerItem) * anglePerItem;
      snapTarget.current = nearest;
    }
  }, [anglePerItem, certificates, snapTo]);

  useEffect(() => {
    const move = (e: MouseEvent) => onMove(e.clientX);
    const up = (e: MouseEvent) => onUp(e.clientX);
    const touchMove = (e: TouchEvent) => { if (e.touches.length) onMove(e.touches[0].clientX); };
    const touchEnd = (e: TouchEvent) => { const t = e.changedTouches[0]; onUp(t ? t.clientX : 0); };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', touchMove, { passive: true });
    window.addEventListener('touchend', touchEnd);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
    };
  }, [onMove, onUp]);

  const selectedCert = certificates.find(c => c.id === selectedId);

  return (
    <div
      className="relative w-full min-h-[600px] flex items-center justify-center overflow-visible px-4 md:px-10"
    >
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

        <div
          className="relative w-[300px] h-[420px] flex items-center justify-center transform-style-3d transition-all duration-700"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={(e) => onDown(e.clientX)}
          onTouchStart={(e) => { if (e.touches.length) onDown(e.touches[0].clientX); }}
        >
          <div
            ref={carouselRef}
            className="relative w-[220px] h-[310px] transform-style-3d will-change-transform"
            style={{
              ['--quantity' as any]: quantity,
              ['--w' as any]: '220px',
              ['--h' as any]: '310px',
              ['--translateZ' as any]: isAnySelected ? '0px' : '380px',
              transform: 'rotateX(-10deg) rotateY(0deg)',
              cursor: dragging.current ? 'grabbing' : 'grab',
            }}
          >
            {certificates.map((cert, index) => {
              const isSelected = selectedId === cert.id;
              const isPlaceholder = cert.id < 0;

              return (
                <div
                  key={cert.id}
                  onPointerDown={() => {
                    pressedCardIdx.current = index;
                  }}
                  className={`absolute inset-0 rounded-2xl overflow-hidden border-2 transition-all duration-500 cursor-pointer group
                    ${isSelected
                      ? 'border-[#ffd86a] shadow-[0_0_60px_rgba(255,216,106,0.4)] z-50'
                      : `border-[#ffd86a]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,216,106,0.1)] hover:border-[#ffd86a]/80 hover:shadow-[0_0_50px_rgba(255,216,106,0.3)] ${isPlaceholder ? 'opacity-40 hover:opacity-100' : ''}`
                    }
                    ${isAnySelected && !isSelected ? 'opacity-0 pointer-events-none scale-90 translate-y-10' : ''}
                  `}
                  style={{
                    ['--index' as any]: index,
                    transform: isSelected
                      ? 'rotateY(0deg) rotateX(8deg) translateZ(180px) translateY(-10px)'
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
                      className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? 'grayscale-0 scale-105' : 'grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105'}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center bg-black/40">
                       <span className="text-[#ffd86a]/50 text-[10px] font-bold uppercase tracking-[0.4em]">{cert.title}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-40 pointer-events-none" />

                  <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden z-10">
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-20 -translate-x-full animate-[cert-shimmer_2.5s_infinite]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedCert && (
            <motion.div
              key={selectedCert.id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col w-full max-w-md relative pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 mb-4 text-[#ffd86a]/60 text-[10px] font-bold uppercase tracking-[0.4em]"
              >
                <span>{selectedCert.issuer || "Certification"}</span>
                <span className="w-1 h-1 rounded-full bg-[#ffd86a]/30" />
                <span>{selectedCert.date}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-[#ffd86a] mb-8 leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(255,216,106,0.2)]"
              >
                {selectedCert.title}
              </motion.h2>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '40px' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-[1px] bg-[#ffd86a]/50 mb-8"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-white/60 text-lg leading-relaxed font-light italic"
              >
                &ldquo;{selectedCert.description}&rdquo;
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ffd86a]/5 rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000 ${selectedId ? 'opacity-30' : 'opacity-100'}`} />
    </div>
  );
};

export default CertificateCarousel;
