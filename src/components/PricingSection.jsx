import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ExternalLink } from 'lucide-react';
import MagneticButton from './MagneticButton';
import './PricingSection.css';

const PricingSection = () => {
    const { t } = useTranslation();
    const notes = t('pricing.notes', { returnObjects: true }) || [];

    const scrollToBook = (e) => {
        e.preventDefault();
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="pricing" className="section pricing-section">
            <div className="container">
                <h2 className="section-title" data-reveal>{t('pricing.title')}</h2>
                <p className="pricing-subtitle" data-reveal data-reveal-delay="1">{t('pricing.subtitle')}</p>

                <div className="pricing-actions" data-reveal data-reveal-delay="2">
                    <MagneticButton className="pricing-cta-magnetic">
                        <a href="#book" className="pricing-cta" onClick={scrollToBook}>
                            <Mail size={18} aria-hidden="true" />
                            <span>{t('pricing.cta')}</span>
                            <span aria-hidden="true" className="pricing-cta-arrow">→</span>
                        </a>
                    </MagneticButton>
                    <a
                        href="https://www.booking.com/hotel/gr/little-loutra-seaside-apartment-loutraki"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pricing-ota"
                    >
                        <span>{t('pricing.booking')}</span>
                        <ExternalLink size={13} aria-hidden="true" />
                    </a>
                    <a
                        href="https://cs.airbnb.com/rooms/1668143537483994329"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pricing-ota"
                    >
                        <span>{t('pricing.airbnb')}</span>
                        <ExternalLink size={13} aria-hidden="true" />
                    </a>
                </div>

                {Array.isArray(notes) && notes.length > 0 && (
                    <ul className="pricing-notes" data-reveal data-reveal-delay="3">
                        {notes.map((note, i) => <li key={i}>{note}</li>)}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default PricingSection;
