import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import './ReservationForm.css';

const ReservationForm = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <section id="book" className="section form-section">
            <div className="container form-container">
                <div className="form-wrapper">
                    <h2 className="section-title">{t('form.title')}</h2>

                    {status === 'success' ? (
                        <div className="success-message">
                            <h3>{t('form.success')}</h3>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="booking-form">
                            <div className="form-group">
                                <label>{t('form.name')}</label>
                                <input type="text" required placeholder="John Doe" />
                            </div>

                            <div className="form-group">
                                <label>{t('form.email')}</label>
                                <input type="email" required placeholder="john@example.com" />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('form.dates')}</label>
                                    <input type="date" required />
                                </div>
                                <div className="form-group">
                                    <label>{t('form.guests')}</label>
                                    <select>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Section Placeholder */}
                            <div className="payment-section">
                                <div className="payment-header">
                                    <Lock size={18} />
                                    <h3>{t('form.paymentTitle')}</h3>
                                </div>
                                <p className="payment-note">
                                    <CheckCircle size={16} />
                                    {t('form.paymentNote')}
                                </p>
                                <div className="payment-methods">
                                    <div className="payment-badge">💳 Stripe</div>
                                    <div className="payment-badge">🅿️ PayPal</div>
                                    <div className="payment-badge">🏦 Bank Transfer</div>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                                <CreditCard size={20} />
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
