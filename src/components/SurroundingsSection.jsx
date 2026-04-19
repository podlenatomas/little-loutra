import React from 'react';
import { useTranslation } from 'react-i18next';
import { Waves, Route, Droplets, Landmark, Mountain, MapPin, Shell } from 'lucide-react';
import './SurroundingsSection.css';

const ICONS = {
    sea: <Waves size={24} aria-hidden="true" />,
    thermal: <Droplets size={24} aria-hidden="true" />,
    canal: <Route size={24} aria-hidden="true" />,
    seal: <Shell size={24} aria-hidden="true" />,
    lagoon: <Landmark size={24} aria-hidden="true" />,
    mountains: <Mountain size={24} aria-hidden="true" />
};

const FALLBACK_ICON = <MapPin size={24} aria-hidden="true" />;

const SurroundingsSection = () => {
    const { t } = useTranslation();
    const items = t('surroundings.items', { returnObjects: true }) || [];

    return (
        <section id="nearby" className="surroundings-section">
            <div className="surroundings-bg"></div>
            <div className="container surroundings-container">
                <h2 className="surroundings-title" data-reveal>{t('surroundings.title')}</h2>
                <p className="surroundings-subtitle" data-reveal data-reveal-delay="1">{t('surroundings.subtitle')}</p>

                <div className="surroundings-grid">
                    {Array.isArray(items) && items.map((item, i) => (
                        <div key={item.key} className="surrounding-card" data-reveal data-reveal-delay={(i % 5) + 1}>
                            <div className="surrounding-icon-wrapper">
                                {ICONS[item.key] || FALLBACK_ICON}
                            </div>
                            <h3 className="surrounding-item-title">{item.title}</h3>
                            <p className="surrounding-item-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SurroundingsSection;
