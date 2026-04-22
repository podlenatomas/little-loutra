import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import './Header.css';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const Header = () => {
    const { t, i18n } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!langOpen) return;
        const onDoc = (e) => {
            if (!langRef.current?.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [langOpen]);

    const changeLanguage = (code) => {
        setLangOpen(false);
        // Switch locale by navigating to the path-based URL (/, /el/, /cs/, /de/).
        // Preserves hash so section links (#book, #about) survive the transition.
        const target = code === 'en' ? '/' : `/${code}/`;
        const hash = window.location.hash || '';
        if (window.location.pathname !== target) {
            window.location.assign(target + hash);
        } else {
            i18n.changeLanguage(code);
        }
    };

    const closeMenu = () => setMenuOpen(false);
    const currentFlag = languages.find((l) => l.code === i18n.language?.split('-')[0])?.flag || '🇬🇧';

    return (
        <>
            <a href="#about" className="skip-link">{t('hero.skipToContent')}</a>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container header-container">
                    <a href="#home" className="logo" aria-label="Little Loutra, home">Little Loutra</a>

                    <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Primary">
                        <a href="#home" onClick={closeMenu}>{t('nav.home')}</a>
                        <a href="#about" onClick={closeMenu}>{t('nav.about')}</a>
                        <a href="#location" onClick={closeMenu}>{t('nav.location')}</a>
                        <a href="#book" className="book-btn" onClick={closeMenu}>{t('nav.book')}</a>

                        <div className="lang-switcher" ref={langRef}>
                            <button
                                type="button"
                                className="lang-btn"
                                onClick={() => setLangOpen((v) => !v)}
                                aria-label={t('nav.language')}
                                aria-haspopup="menu"
                                aria-expanded={langOpen}
                            >
                                <Globe size={18} aria-hidden="true" />
                                <span aria-hidden="true">{currentFlag}</span>
                            </button>
                            {langOpen && (
                                <div className="lang-dropdown" role="menu">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            role="menuitem"
                                            onClick={() => changeLanguage(lang.code)}
                                            aria-current={lang.code === i18n.language?.split('-')[0] ? 'true' : undefined}
                                        >
                                            {lang.flag} {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    <button
                        type="button"
                        className="mobile-toggle"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? t('nav.closeMenu') : t('nav.menu')}
                        aria-expanded={menuOpen}
                        aria-controls="primary-nav"
                    >
                        {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
