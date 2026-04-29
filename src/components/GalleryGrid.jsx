import React from 'react';
import { useTranslation } from 'react-i18next';
import './GalleryGrid.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop';

const GalleryGrid = () => {
    const { t } = useTranslation();

    const images = [
        { src: '/images/apt-11.jpg', captionKey: 'bed' },
        { src: '/images/apt-04.jpg', captionKey: 'sofa' },
        { src: '/images/apt-07.jpg', captionKey: 'dining' },
        { src: '/images/apt-08.jpg', captionKey: 'kitchen' },
        { src: '/images/apt-09.jpg', captionKey: 'bathroom' },
        { src: '/images/apt-10.jpg', captionKey: 'hallway' },
        // TODO: replace with real balcony photo (currently a placeholder duplicate)
        { src: '/images/apt-04.jpg', captionKey: 'balcony' }
    ];

    const fallback = (e) => {
        if (e.target.dataset.fallback !== '1') {
            e.target.dataset.fallback = '1';
            e.target.src = PLACEHOLDER;
        }
    };

    return (
        <section className="section gallery-section" aria-label="Photos">
            <div className="container">
                <div className="gallery-row">
                    {images.map((img, i) => (
                        <figure key={img.captionKey} className="gallery-item tile" data-reveal data-reveal-delay={(i % 5) + 1}>
                            <img src={img.src} alt={t(`gallery.${img.captionKey}`)} loading="lazy" onError={fallback} />
                            <figcaption className="gallery-caption">{t(`gallery.${img.captionKey}`)}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryGrid;
