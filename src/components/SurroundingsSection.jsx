import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Waves, Mountain } from 'lucide-react';
import './SurroundingsSection.css';

const SurroundingsSection = () => {
    const { t } = useTranslation();

    const surroundings = [
        {
            icon: <MapPin size={24} />,
            title: t('surroundings.casino'),
            desc: t('surroundings.casinoDesc')
        },
        {
            icon: <Waves size={24} />,
            title: t('surroundings.lagoon'),
            desc: t('surroundings.lagoonDesc')
        },
        {
            icon: <Mountain size={24} />,
            title: t('surroundings.mountains'),
            desc: t('surroundings.mountainsDesc')
        },
    ];

    return (
        <section className="surroundings-section">
            <div className="surroundings-bg"></div>
            <div className="container surroundings-container">
                <h2 className="surroundings-title">{t('surroundings.title')}</h2>

                <div className="surroundings-grid">
                    {surroundings.map((item, index) => (
                        <div key={index} className="surrounding-card">
                            <div className="surrounding-icon-wrapper">
                                {item.icon}
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
