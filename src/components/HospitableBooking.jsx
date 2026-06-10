import React from 'react';
import { useTranslation } from 'react-i18next';

const HospitableBooking = () => {
    const { t } = useTranslation();

    return (
        <section id="book" className="section form-section">
            <div className="container form-container">
                <div className="form-wrapper" data-reveal>
                    <h2 className="section-title">{t('booking.title')}</h2>
                    <iframe
                        id="booking-iframe"
                        title="Booking"
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"
                        style={{ width: '100%', height: '900px', border: 0, display: 'block' }}
                        src="https://booking.hospitable.com/widget/a1fddc69-e603-4b37-95a3-4bfd6f25188a/2286458"
                    />
                </div>
            </div>
        </section>
    );
};

export default HospitableBooking;
