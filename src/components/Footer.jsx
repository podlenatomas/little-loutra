import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import './Footer.css';

// TODO: replace with real profile URLs and contact details
const CONTACT = {
    instagram: 'https://www.instagram.com/', // TODO
    facebook: 'https://www.facebook.com/',   // TODO
    phone: '+30 274 406 6000',               // TODO: verify
    phoneHref: 'tel:+302744066000',
    email: 'stay@littleloutra.com'
};

const Footer = ({ onOpenLegal }) => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const scrollToBook = (e) => {
        e.preventDefault();
        document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column">
                        <h3 className="footer-logo">Little Loutra</h3>
                        <p className="footer-description">{t('footer.description')}</p>
                        <div className="social-links">
                            <a
                                href={CONTACT.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label={t('a11y.socialInstagram')}
                            >
                                <Instagram size={20} aria-hidden="true" />
                            </a>
                            <a
                                href={CONTACT.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                aria-label={t('a11y.socialFacebook')}
                            >
                                <Facebook size={20} aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.contactTitle')}</h4>
                        <address className="contact-list">
                            <div className="contact-item">
                                <MapPin size={18} aria-hidden="true" />
                                <div>
                                    <p>Loutraki</p>
                                    <p>203 00, Greece</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} aria-hidden="true" />
                                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} aria-hidden="true" />
                                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                            </div>
                        </address>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><a href="#about">{t('nav.about')}</a></li>
                            <li><a href="#amenities">{t('amenities.title')}</a></li>
                            <li><a href="#nearby">{t('surroundings.title')}</a></li>
                            <li><a href="#pricing">{t('footer.pricing')}</a></li>
                            <li><a href="#faq">{t('footer.faq')}</a></li>
                            <li><a href="#book" onClick={scrollToBook}>{t('nav.book')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4 className="footer-title">{t('footer.legalTitle')}</h4>
                        <ul className="footer-links">
                            <li><button type="button" className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>{t('footer.privacy')}</button></li>
                            <li><button type="button" className="footer-link-btn" onClick={() => onOpenLegal('terms')}>{t('footer.terms')}</button></li>
                            <li><button type="button" className="footer-link-btn" onClick={() => onOpenLegal('cancellation')}>{t('footer.cancellation')}</button></li>
                            <li><button type="button" className="footer-link-btn" onClick={() => onOpenLegal('cookiesPage')}>{t('footer.cookies')}</button></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} Little Loutra. {t('footer.rights')}</p>
                    <p className="footer-credit">{t('footer.credit')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
