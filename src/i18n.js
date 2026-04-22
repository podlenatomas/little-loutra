import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import el from './locales/el';
import cs from './locales/cs';
import de from './locales/de';

const SUPPORTED = ['en', 'el', 'cs', 'de'];

// Path-based locale detection: /el/... → el, /cs/... → cs, etc.
// Runs before the standard detectors so the URL is authoritative.
const pathDetector = {
    name: 'path',
    lookup() {
        if (typeof window === 'undefined') return undefined;
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        return SUPPORTED.includes(seg) ? seg : undefined;
    }
};

const detector = new LanguageDetector();
detector.addDetector(pathDetector);

i18n
    .use(detector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            el: { translation: el },
            cs: { translation: cs },
            de: { translation: de }
        },
        supportedLngs: SUPPORTED,
        fallbackLng: 'en',
        detection: {
            order: ['path', 'querystring', 'localStorage', 'navigator', 'htmlTag'],
            lookupQuerystring: 'lng',
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
