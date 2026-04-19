import React from 'react';
import { useTranslation } from 'react-i18next';
import './MeaningSection.css';

const MeaningSection = () => {
    const { t } = useTranslation();

    return (
        <section className="section meaning-section">
            <div className="meaning-bg-text">LOUTRAKI</div>
            <div className="container meaning-container">
                <h2 className="meaning-title" data-reveal>{t('meaning.title')}</h2>
                <div className="meaning-content">
                    <p className="meaning-etymology" data-reveal data-reveal-delay="1">{t('meaning.etymology')}</p>

                    <div className="meaning-stats" data-reveal data-reveal-delay="2">
                        <div className="stat-item">
                            <span className="stat-value">{t('meaning.year')}</span>
                            <span className="stat-label">{t('meaning.yearLabel')}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">{t('meaning.temp')}</span>
                            <span className="stat-label">{t('meaning.tempLabel')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MeaningSection;
