import { useEffect } from 'react';
import Lenis from 'lenis';

// Global Lenis instance exposed on window so anchor clicks / scrollTo calls
// elsewhere can use lenis.scrollTo instead of the native scroll (which Lenis
// otherwise intercepts anyway).
let lenisRef = null;

export function getLenis() {
    return lenisRef;
}

export default function useSmoothScroll() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false
        });
        lenisRef = lenis;

        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // Intercept in-page anchor clicks so the scroll is smoothed via Lenis.
        const onAnchorClick = (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        };
        document.addEventListener('click', onAnchorClick);

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('click', onAnchorClick);
            lenis.destroy();
            if (lenisRef === lenis) lenisRef = null;
        };
    }, []);
}
