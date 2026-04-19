import React, { useRef } from 'react';

/**
 * Subtle magnetic hover: the child is pulled toward the cursor while the
 * wrapper is hovered and springs back on leave. Disabled on touch/coarse
 * pointer devices.
 */
const MagneticButton = ({ children, strength = 0.35, className = '' }) => {
    const wrapRef = useRef(null);
    const innerRef = useRef(null);

    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    const onMove = (e) => {
        if (isTouch || !wrapRef.current || !innerRef.current) return;
        const rect = wrapRef.current.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onLeave = () => {
        if (innerRef.current) innerRef.current.style.transform = 'translate3d(0, 0, 0)';
    };

    return (
        <div
            ref={wrapRef}
            className={`magnetic ${className}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            <span ref={innerRef} className="magnetic-inner">
                {children}
            </span>
        </div>
    );
};

export default MagneticButton;
