import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, Wind, UtensilsCrossed, Sun } from 'lucide-react';
import './AmenitiesSection.css';

const ICONS = {
    wifi: <Wifi size={32} aria-hidden="true" />,
    climate: <Wind size={32} aria-hidden="true" />,
    kitchen: <UtensilsCrossed size={32} aria-hidden="true" />,
    balcony: <Sun size={32} aria-hidden="true" />
};

const AmenitiesSection = () => {
    const { t } = useTranslation();
    const items = t('amenities.items', { returnObjects: true }) || [];

    return (
        <section id="amenities" className="section amenities-section">
            <div className="container">
                <h4 className="amenities-label" data-reveal>{t('amenities.title')}</h4>

                <div className="amenities-grid">
                    {Array.isArray(items) && items.map((item, i) => (
                        <div key={item.key} className="amenity-card" data-reveal data-reveal-delay={(i % 5) + 1}>
                            <div className="amenity-icon">{ICONS[item.key]}</div>
                            <div className="amenity-body">
                                <span className="amenity-text">{item.title}</span>
                                {item.detail && <span className="amenity-detail">{item.detail}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AmenitiesSection;
