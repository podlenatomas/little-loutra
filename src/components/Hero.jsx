import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section id="home" className="hero-section">
            <div className="hero-background">
                {/* Placeholder for actual image - using a nice gradient for now or a reliable placeholder URL */}
                <div className="hero-overlay"></div>
                {/* We will try to load a nice sea/apartment image later */}
            </div>

            <div className="container hero-content">
                <h1 className="hero-title fade-in-up">
                    LI<span style={{ letterSpacing: '-14px' }}>T</span>TLE LOUTRA
                </h1>
                <p className="hero-subtitle fade-in-up delay-1">{t('hero.subtitle')}</p>
                <a href="#book" className="hero-cta fade-in-up delay-2">{t('hero.cta')}</a>
            </div>
        </section>
    );
};

export default Hero;
