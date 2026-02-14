import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BedDouble, MapPin, Watch } from 'lucide-react';
import './InfoSection.css';

const InfoSection = () => {
    const { t } = useTranslation();

    const features = [
        { icon: <Users size={32} />, label: t('features.guests') },
        { icon: <BedDouble size={32} />, label: t('features.bedroom') },
        { icon: <MapPin size={32} />, label: t('features.sea') },
        { icon: <Watch size={32} />, label: t('features.athens') }
    ];

    return (
        <section id="about" className="section info-section">
            <div className="container">
                <div className="info-grid">
                    <div className="info-text">
                        <h2 className="section-title text-left">{t('about.title')}</h2>
                        <p className="info-description">{t('about.description')}</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <span className="feature-label">{feature.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
