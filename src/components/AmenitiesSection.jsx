import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, Wind, Key, Sun, Waves } from 'lucide-react';
import './AmenitiesSection.css';

const AmenitiesSection = () => {
    const { t } = useTranslation();

    const amenities = [
        { icon: <Wifi size={32} />, title: t('amenities.wifi') },
        { icon: <Wind size={32} />, title: t('amenities.climate') },
        { icon: <Key size={32} />, title: t('amenities.entry') },
        { icon: <Sun size={32} />, title: t('amenities.terrace') },
    ];

    return (
        <section className="section amenities-section">
            <div className="container">
                <h4 className="amenities-label">{t('amenities.title')}</h4>

                <div className="amenities-grid">
                    {amenities.map((item, index) => (
                        <div key={index} className="amenity-card">
                            <div className="amenity-icon">{item.icon}</div>
                            <span className="amenity-text">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AmenitiesSection;
