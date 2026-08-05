import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Shared cinematic ease for the cover intro — the same curve the reference
   landing uses for every entrance. */
const HERO_EASE = [0.16, 1, 0.3, 1];

/* Splits each line into words and pulls them up one by one (y: 24 -> 0),
   staggered at 0.08s. Lines render as blocks so the heading keeps its manual
   line break on every locale. */
export function WordsPullUp({ lines, startDelay = 0.15 }) {
  const reduceMotion = useReducedMotion();
  let wordIndex = 0;

  return lines.map((line, lineIndex) => (
    <span className="hero-pull-up__line" key={lineIndex}>
      {line.split(' ').map((word, index, words) => {
        const delay = startDelay + wordIndex * 0.08;
        wordIndex += 1;
        return (
          <motion.span
            className="hero-pull-up__word"
            key={`${word}-${index}`}
            initial={reduceMotion ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay, ease: HERO_EASE }}
          >
            {index < words.length - 1 ? `${word} ` : word}
          </motion.span>
        );
      })}
    </span>
  ));
}

/* Publishes the cover's scroll progress (0 -> 1 across its own height) as a CSS
   variable, so the parallax layers are pure CSS transforms. Written straight to
   the element rather than through motion values: framer's useScroll reads the
   target ref before React attaches it here, which pinned progress at zero. */
export function useCoverParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = el.offsetHeight || window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      el.style.setProperty('--cover-scroll', progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export function FadeUp({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay, ease: HERO_EASE }}
    >
      {children}
    </motion.div>
  );
}
