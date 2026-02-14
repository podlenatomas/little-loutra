import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* About Section */}
                    <div className="footer-column">
                        <h3 className="footer-logo">Little Loutra</h3>
                        <p className="footer-description">
                            {t('footer.description')}
                        </p>
                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Instagram size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.contactTitle')}</h4>
                        <div className="contact-list">
                            <div className="contact-item">
                                <MapPin size={18} />
                                <div>
                                    <p>Loutraki Perachora</p>
                                    <p>203 00, Greece</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} />
                                <a href="tel:+302744066000">+30 274 406 6000</a>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} />
                                <a href="mailto:info@littleloutra.com">info@littleloutra.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><a href="#about">{t('nav.about')}</a></li>
                            <li><a href="#book">{t('nav.book')}</a></li>
                            <li><a href="#">{t('footer.gallery')}</a></li>
                            <li><a href="#">{t('footer.reviews')}</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.legalTitle')}</h4>
                        <ul className="footer-links">
                            <li><a href="#">{t('footer.privacy')}</a></li>
                            <li><a href="#">{t('footer.terms')}</a></li>
                            <li><a href="#">{t('footer.cancellation')}</a></li>
                            <li><a href="#">{t('footer.cookies')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Little Loutra. {t('footer.rights')}</p>
                    <p className="footer-credit">Designed with ❤️ in Greece</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
