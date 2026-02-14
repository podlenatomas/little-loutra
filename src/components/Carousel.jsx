import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const images = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop', // Interior
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop', // Bedroom
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop', // View
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop', // Kitchen
];

const Carousel = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="carousel-section">
            <div className="container">
                <div className="carousel-wrapper">
                    <button className="carousel-btn left" onClick={() => scroll('left')}>
                        <ChevronLeft size={24} />
                    </button>

                    <div className="carousel-track" ref={scrollRef}>
                        {images.map((src, index) => (
                            <div key={index} className="carousel-item">
                                <img src={src} alt={`Apartment view ${index + 1}`} loading="lazy" />
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn right" onClick={() => scroll('right')}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Carousel;
