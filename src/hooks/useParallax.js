import { useEffect } from 'react';

/**
 * Scroll-linked parallax translateY on the referenced element.
 * `speed` is the fraction of scroll velocity (0 = static, 1 = moves with scroll).
 * Negative speed moves element up while page scrolls down (classic bg parallax).
 */
export default function useParallax(ref, speed = -0.3) {
    useEffect(() => {
        if (!ref.current || typeof window === 'undefined') return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const container = ref.current.parentElement || ref.current;
        let ticking = false;

        const update = () => {
            if (!ref.current) { ticking = false; return; }
            const rect = container.getBoundingClientRect();
            // Only update while container is anywhere near the viewport
            if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
                ticking = false;
                return;
            }
            // How far the container's top has scrolled past 0
            const offset = -rect.top * speed;
            ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => window.removeEventListener('scroll', onScroll);
    }, [ref, speed]);
}
