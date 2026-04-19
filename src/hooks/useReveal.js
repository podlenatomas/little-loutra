import { useEffect } from 'react';

// Observer sets inline style on intersection. Using inline style (not a class)
// so React className updates on the same element don't wipe out visibility.

let observer = null;

const reveal = (el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.dataset.revealed = 'true';
};

const init = () => {
    if (observer || typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        document.querySelectorAll('[data-reveal]').forEach(reveal);
        return;
    }
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
};

const observeAll = () => {
    init();
    if (!observer) return;
    document.querySelectorAll('[data-reveal]:not([data-revealed="true"])').forEach((el) => {
        observer.observe(el);
    });
};

export default function useReveal() {
    useEffect(() => {
        observeAll();
        const t = setTimeout(observeAll, 80);
        return () => clearTimeout(t);
    });
}
