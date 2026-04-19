import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import './ReservationForm.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const todayISO = () => new Date().toISOString().slice(0, 10);

// Site key is public (embedded in the JS bundle, visible in DevTools to any
// visitor). It's safe to hardcode. The matching *secret* key stays as a Worker
// env var. VITE_TURNSTILE_SITE_KEY env var overrides if set (useful for
// staging or alternate sites).
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAAC_usOwkhLsrF0LA';

const ReservationForm = ({ onOpenLegal }) => {
    const { t, i18n } = useTranslation();
    const today = useMemo(todayISO, []);

    const [form, setForm] = useState({
        name: '',
        email: '',
        checkIn: '',
        checkOut: '',
        guests: '2',
        message: '',
        consent: false,
        website: '' // honeypot
    });
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [error, setError] = useState(null);
    const [captchaToken, setCaptchaToken] = useState('');
    const captchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    // Render Turnstile widget when site key is configured and script is loaded.
    useEffect(() => {
        if (!TURNSTILE_SITE_KEY || !captchaRef.current) return;

        let cancelled = false;
        const tryRender = () => {
            if (cancelled) return;
            if (!window.turnstile || !captchaRef.current) {
                setTimeout(tryRender, 200);
                return;
            }
            // Avoid double-render on HMR
            if (widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(captchaRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                callback: (token) => setCaptchaToken(token),
                'error-callback': () => setCaptchaToken(''),
                'expired-callback': () => setCaptchaToken(''),
                theme: 'light'
            });
        };
        tryRender();

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch { /* widget already gone */ }
                widgetIdRef.current = null;
            }
        };
    }, []);

    const update = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [key]: value }));
    };

    const validate = () => {
        if (!EMAIL_RE.test(form.email)) return t('form.invalidEmail');
        if (!form.checkIn || !form.checkOut) return t('form.invalidDates');
        if (form.checkOut <= form.checkIn) return t('form.invalidDates');
        if (!form.consent) return t('form.consentRequired');
        if (TURNSTILE_SITE_KEY && !captchaToken) return t('form.captchaRequired');
        return null;
    };

    const resetCaptcha = () => {
        setCaptchaToken('');
        if (widgetIdRef.current && window.turnstile) {
            try { window.turnstile.reset(widgetIdRef.current); } catch { /* noop */ }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const msg = validate();
        if (msg) { setError(msg); return; }

        setStatus('submitting');
        try {
            const res = await fetch('/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, locale: i18n.language, captchaToken })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setStatus('success');
        } catch {
            setStatus('error');
            setError(t('form.error'));
            resetCaptcha();
        }
    };

    return (
        <section id="book" className="section form-section">
            <div className="container form-container">
                <div className="form-wrapper" data-reveal>
                    <h2 className="section-title">{t('form.title')}</h2>

                    {status === 'success' ? (
                        <div className="success-message" role="status">
                            <CheckCircle size={48} aria-hidden="true" />
                            <h3>{t('form.success')}</h3>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="booking-form" noValidate>
                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                onChange={update('website')}
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="honeypot"
                            />

                            <div className="form-group">
                                <label htmlFor="res-name">{t('form.name')}</label>
                                <input
                                    id="res-name"
                                    name="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={update('name')}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="res-email">{t('form.email')}</label>
                                <input
                                    id="res-email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={update('email')}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="res-checkin">{t('form.checkIn')}</label>
                                    <input
                                        id="res-checkin"
                                        name="checkIn"
                                        type="date"
                                        required
                                        min={today}
                                        value={form.checkIn}
                                        onChange={update('checkIn')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="res-checkout">{t('form.checkOut')}</label>
                                    <input
                                        id="res-checkout"
                                        name="checkOut"
                                        type="date"
                                        required
                                        min={form.checkIn || today}
                                        value={form.checkOut}
                                        onChange={update('checkOut')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="res-guests">{t('form.guests')}</label>
                                    <select
                                        id="res-guests"
                                        name="guests"
                                        value={form.guests}
                                        onChange={update('guests')}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="res-message">{t('form.message')}</label>
                                <textarea
                                    id="res-message"
                                    name="message"
                                    rows={3}
                                    maxLength={1000}
                                    placeholder={t('form.messagePlaceholder')}
                                    value={form.message}
                                    onChange={update('message')}
                                />
                            </div>

                            <div className="form-consent">
                                <input
                                    id="res-consent"
                                    name="consent"
                                    type="checkbox"
                                    checked={form.consent}
                                    onChange={update('consent')}
                                />
                                <label htmlFor="res-consent">
                                    <button
                                        type="button"
                                        className="inline-link"
                                        onClick={() => onOpenLegal?.('privacy')}
                                    >
                                        {t('form.consent')}
                                    </button>
                                </label>
                            </div>

                            {TURNSTILE_SITE_KEY && (
                                <div className="form-captcha" ref={captchaRef} />
                            )}

                            <div className="payment-section">
                                <div className="payment-header">
                                    <Lock size={18} aria-hidden="true" />
                                    <h3>{t('form.paymentTitle')}</h3>
                                </div>
                                <p className="payment-note">
                                    <CheckCircle size={16} aria-hidden="true" />
                                    {t('form.paymentNote')}
                                </p>
                            </div>

                            {error && (
                                <div className="form-error" role="alert">
                                    <AlertCircle size={16} aria-hidden="true" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                                <CreditCard size={20} aria-hidden="true" />
                                {status === 'submitting' ? t('form.processing') : t('form.submit')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReservationForm;
