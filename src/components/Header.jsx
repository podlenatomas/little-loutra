import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import './Header.css'; // specific styles for header

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <div className="logo">Little Loutra</div>

                <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                    <a href="#home" onClick={() => setMenuOpen(false)}>{t('nav.home')}</a>
                    <a href="#about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</a>
                    <a href="#location" onClick={() => setMenuOpen(false)}>{t('nav.location')}</a>
                    <a href="#book" className="book-btn" onClick={() => setMenuOpen(false)}>{t('nav.book')}</a>

                    <div className="lang-switcher">
                        <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                            <Globe size={18} />
                            <span>{languages.find(l => l.code === i18n.language)?.flag || '🇬🇧'}</span>
                        </button>
                        {langOpen && (
                            <div className="lang-dropdown">
                                {languages.map((lang) => (
                                    <button key={lang.code} onClick={() => changeLanguage(lang.code)}>
                                        {lang.flag} {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
