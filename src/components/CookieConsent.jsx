import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CookieConsent.css';

const STORAGE_KEY = 'll_consent';

const hasConsent = () => {
    try {
        return !!localStorage.getItem(STORAGE_KEY);
    } catch {
        return false;
    }
};

const CookieConsent = ({ onLearnMore }) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(() => !hasConsent());

    const decide = (choice) => {
        try {
            localStorage.setItem(STORAGE_KEY, choice);
            if (choice === 'declined') {
                localStorage.removeItem('i18nextLng');
            }
        } catch { /* storage disabled */ }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="consent-card" role="dialog" aria-live="polite" aria-label={t('cookies.title')}>
            <div className="consent-inner">
                <div className="consent-text">
                    <strong>{t('cookies.title')}</strong>
                    <p>{t('cookies.message')}</p>
                </div>
                <div className="consent-actions">
                    <button type="button" className="consent-btn secondary" onClick={() => decide('declined')}>
                        {t('cookies.decline')}
                    </button>
                    <button type="button" className="consent-btn primary" onClick={() => decide('accepted')}>
                        {t('cookies.accept')}
                    </button>
                    <button type="button" className="consent-btn link" onClick={() => onLearnMore?.('cookiesPage')}>
                        {t('cookies.learnMore')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
