import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import loan1 from '../assets/loan1.jpg';
import loan2 from '../assets/loan2.jpg';
import loan3 from '../assets/loan3.jpg';
import loan4 from '../assets/loan4.jpg';
import loan5 from '../assets/loan5.jpg';
import '../css/carousel.css';

const DEFAULT_ITEMS = [
  {
    id: 1,
    image: loan1,
    tag: 'Finance',
    title: 'Trusted Loan Service',
    description: 'Secure and trusted loan platform for everyone.',
    accent: '#a855f7',
  },
  {
    id: 2,
    image: loan2,
    tag: 'Approval',
    title: 'Instant Loan Approval',
    description: 'Enjoy flexible repayment with low interest.',
    accent: '#22d3ee',
  },
  {
    id: 3,
    image: loan3,
    tag: 'Interest',
    title: 'Low Interest Rate 10%',
    description: 'Save more with our lowest interest rates.',
    accent: '#f97316',
  },
  {
    id: 4,
    image: loan4,
    tag: 'EMI',
    title: 'Fast EMI Payments',
    description: 'Easy EMI options for your convenience.',
    accent: '#10b981',
  },
  {
    id: 5,
    image: loan5,
    tag: 'Security',
    title: 'Safe & Secure',
    description: 'Your financial data is fully protected.',
    accent: '#f59e0b',
  },
];

const SPRING = { type: 'spring', stiffness: 280, damping: 28 };
const DRAG_BUFFER = 40;
const VELOCITY_THRESHOLD = 500;

export default function Carousel({
  items = DEFAULT_ITEMS,
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true,
}) {
  const itemsForRender = useMemo(() => {
    if (!loop || items.length === 0) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const activeIndex =
    items.length === 0
      ? 0
      : loop
      ? (position - 1 + items.length) % items.length
      : Math.min(position, items.length - 1);

  const activeItem = items[activeIndex] ?? items[0];

  /* ── progress bar ── */
  const runProgress = (ts) => {
    if (!startRef.current) startRef.current = ts;
    const pct = Math.min(((ts - startRef.current) / autoplayDelay) * 100, 100);
    setProgress(pct);
    if (pct < 100) rafRef.current = requestAnimationFrame(runProgress);
  };

  const resetProgress = () => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setProgress(0);
    rafRef.current = requestAnimationFrame(runProgress);
  };

  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    rafRef.current = requestAnimationFrame(runProgress);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoplay, isHovered, pauseOnHover, position]);

  /* ── autoplay timer ── */
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    const t = setInterval(() => {
      setPosition(p => p + 1);
      resetProgress();
    }, autoplayDelay);
    return () => clearInterval(t);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  /* ── hover ── */
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;
    const el = containerRef.current;
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, [pauseOnHover]);

  /* ── loop jump ── */
  const handleAnimationStart = () => setIsAnimating(true);
  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) { setIsAnimating(false); return; }
    if (position === itemsForRender.length - 1) {
      setIsJumping(true); setPosition(1);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
      return;
    }
    if (position === 0) {
      setIsJumping(true); setPosition(items.length);
      requestAnimationFrame(() => { setIsJumping(false); setIsAnimating(false); });
      return;
    }
    setIsAnimating(false);
  };

  /* ── drag ── */
  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const dir =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1
      : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1
      : 0;
    if (dir === 0) return;
    setPosition(p => Math.max(0, Math.min(p + dir, itemsForRender.length - 1)));
    resetProgress();
  };

  const goTo  = (idx) => { setPosition(loop ? idx + 1 : idx); resetProgress(); };
  const goNext = () => { setPosition(p => p + 1); resetProgress(); };
  const goPrev = () => { setPosition(p => Math.max(p - 1, 0)); resetProgress(); };

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING;

  return (
    <div className="cs-root" ref={containerRef}>

      {/* Ambient glow */}
      <motion.div
        className="cs-glow"
        animate={{
          background: `radial-gradient(ellipse 90% 70% at 65% 45%, ${activeItem.accent}40 0%, transparent 68%)`,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Slide track */}
      <div className="cs-clip">
        <motion.div
          className="cs-track"
          drag={isAnimating ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          style={{ width: `${itemsForRender.length * 100}%` }}
          animate={{ x: `${-(position / itemsForRender.length) * 100}%` }}
          transition={effectiveTransition}
          onDragEnd={handleDragEnd}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => {
            const itemActive = loop ? index - 1 === activeIndex : index === activeIndex;
            return (
              <div
                key={`${item.id}-${index}`}
                className="cs-slide"
                style={{ width: `${100 / itemsForRender.length}%` }}
              >
                {/* Image */}
                <motion.div
                  className="cs-img-wrap"
                  animate={{ scale: itemActive ? 1.06 : 1 }}
                  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <img src={item.image} alt={item.title} className="cs-img" />
                </motion.div>

                {/* Overlays */}
                <div className="cs-overlay-base" />
                <div className="cs-overlay-grad" />

                {/* Text content */}
                <div className="cs-content">
                  <motion.span
                    className="cs-tag"
                    style={{ color: item.accent, borderColor: `${item.accent}66` }}
                    initial={false}
                    animate={itemActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.45, delay: 0.06 }}
                  >
                    {item.tag}
                  </motion.span>

                  <motion.h2
                    className="cs-title"
                    initial={false}
                    animate={itemActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.14 }}
                  >
                    {item.title}
                  </motion.h2>

                  <motion.p
                    className="cs-desc"
                    initial={false}
                    animate={itemActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{ duration: 0.45, delay: 0.22 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Prev / Next */}
      <button className="cs-nav cs-prev" onClick={goPrev} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button className="cs-nav cs-next" onClick={goNext} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Bottom bar */}
      <div className="cs-bottom">
        <div className="cs-dots">
          {items.map((item, i) => (
            <motion.button
              key={i}
              className="cs-dot"
              onClick={() => goTo(i)}
              animate={{
                width: activeIndex === i ? 28 : 8,
                backgroundColor: activeIndex === i ? item.accent : 'rgba(255,255,255,0.28)',
              }}
              transition={{ duration: 0.3 }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="cs-progress-track">
          <motion.div
            className="cs-progress-fill"
            style={{ backgroundColor: activeItem.accent }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.08, ease: 'linear' }}
          />
        </div>

        <span className="cs-count">
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <span className="cs-count-sep"> / </span>
          {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}