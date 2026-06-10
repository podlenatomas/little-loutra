import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './HospitableBooking.css';

const WIDGET_ORIGIN = 'https://booking.hospitable.com';
const WIDGET_SUPPORTED = new Set(['en', 'de', 'fr', 'es']);

const mapLocale = (lang) => {
    const code = (lang || 'en').slice(0, 2).toLowerCase();
    return WIDGET_SUPPORTED.has(code) ? code : 'en';
};

const HospitableBooking = () => {
    const { t, i18n } = useTranslation();
    const i18nLang = (i18n.language || 'en').slice(0, 2).toLowerCase();
    const widgetLang = mapLocale(i18nLang);
    const showFallbackNotice = i18nLang === 'cs' || i18nLang === 'el';
    const iframeRef = useRef(null);
    const widgetLangRef = useRef(widgetLang);
    widgetLangRef.current = widgetLang;

    useEffect(() => {
        const handler = (e) => {
            if (e.origin !== WIDGET_ORIGIN) return;
            if (e.data?.type !== 'GET_HOSPITABLE_LANGUAGE') return;
            e.source?.postMessage(
                { type: 'SET_HOSPITABLE_LANGUAGE', language: widgetLangRef.current },
                WIDGET_ORIGIN
            );
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    useEffect(() => {
        iframeRef.current?.contentWindow?.postMessage(
            { type: 'SET_HOSPITABLE_LANGUAGE', language: widgetLang },
            WIDGET_ORIGIN
        );
    }, [widgetLang]);

    return (
        <section id="book" className="section booking-section">
            <div className="container" data-reveal>
                <h2 className="section-title">{t('booking.title')}</h2>
                <div className="booking-frame">
                    <iframe
                        id="booking-iframe"
                        ref={iframeRef}
                        className="booking-iframe"
                        title="Booking"
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"
                        src="https://booking.hospitable.com/widget/a1fddc69-e603-4b37-95a3-4bfd6f25188a/2286458"
                    />
                </div>
                {showFallbackNotice && (
                    <p
                        className="booking-notice"
                        dangerouslySetInnerHTML={{ __html: t('booking.fallbackNotice') }}
                    />
                )}
            </div>
        </section>
    );
};

export default HospitableBooking;
