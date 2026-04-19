import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OG_LOCALE = { en: 'en_US', el: 'el_GR', cs: 'cs_CZ', de: 'de_DE' };

const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute(attr, value);
};

/**
 * Keeps `<html lang>`, `<title>`, and social meta tags in sync with the current
 * i18n language. Crawlers that execute JS (Googlebot) will pick up localized
 * meta; static OG/Twitter tags from index.html cover the default (English).
 */
export default function useDocumentLang() {
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const lang = i18n.language?.split('-')[0] || 'en';
        document.documentElement.lang = lang;

        const title = t('meta.title');
        const desc = t('meta.description');
        const safeTitle = title && title !== 'meta.title' ? title : null;
        const safeDesc = desc && desc !== 'meta.description' ? desc : null;

        if (safeTitle) document.title = safeTitle;
        if (safeDesc) setMeta('meta[name="description"]', 'content', safeDesc);

        // Social meta
        if (safeTitle) {
            setMeta('meta[property="og:title"]', 'content', safeTitle);
            setMeta('meta[name="twitter:title"]', 'content', safeTitle);
        }
        if (safeDesc) {
            setMeta('meta[property="og:description"]', 'content', safeDesc);
            setMeta('meta[name="twitter:description"]', 'content', safeDesc);
        }
        setMeta('meta[property="og:locale"]', 'content', OG_LOCALE[lang] || 'en_US');
    }, [i18n.language, t]);
}
