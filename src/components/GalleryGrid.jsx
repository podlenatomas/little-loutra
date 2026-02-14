import React from 'react';
import './GalleryGrid.css';

const images = [
    { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop', alt: 'Main Living Room', type: 'large' },
    { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop', alt: 'Bedroom Comfort', type: 'small' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop', alt: 'Kitchen Detail', type: 'small' }
];

const GalleryGrid = () => {
    return (
        <section className="section gallery-section">
            <div className="container">
                <div className="gallery-grid">
                    <div className="gallery-item large">
                        <img src={images[0].src} alt={images[0].alt} loading="lazy" />
                    </div>
                    <div className="gallery-stack">
                        <div className="gallery-item small">
                            <img src={images[1].src} alt={images[1].alt} loading="lazy" />
                        </div>
                        <div className="gallery-item small">
                            <img src={images[2].src} alt={images[2].alt} loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GalleryGrid;
