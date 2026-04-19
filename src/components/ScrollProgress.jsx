import React, { useEffect, useState } from 'react';
import './ScrollProgress.css';

const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let ticking = false;
        const update = () => {
            const h = document.documentElement;
            const total = h.scrollHeight - h.clientHeight;
            const p = total > 0 ? (window.scrollY / total) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, p)));
            ticking = false;
        };
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            className="scroll-progress"
            style={{ transform: `scaleX(${progress / 100})` }}
            aria-hidden="true"
        />
    );
};

export default ScrollProgress;
