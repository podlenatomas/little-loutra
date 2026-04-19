import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MagneticButton from './MagneticButton';
import WeatherWidget from './WeatherWidget';
import useParallax from '../hooks/useParallax';
import './Hero.css';

const Hero = () => {
    const { t } = useTranslation();
    const bgRef = useRef(null);
    useParallax(bgRef, -0.25);

    return (
        <section id="home" className="hero-section">
            <div className="hero-background" ref={bgRef}>
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-content">
                <h1 className="hero-title fade-in-up">
                    LI<span style={{ letterSpacing: '-14px' }}>T</span>TLE LOUTRA
                </h1>
                <p className="hero-subtitle fade-in-up delay-1">{t('hero.subtitle')}</p>
                <div className="fade-in-up delay-2 hero-cta-wrap">
                    <MagneticButton className="hero-cta-magnetic">
                        <a href="#book" className="hero-cta">{t('hero.cta')}</a>
                    </MagneticButton>
                </div>
            </div>

            <WeatherWidget variant="hero" />
        </section>
    );
};

export default Hero;
