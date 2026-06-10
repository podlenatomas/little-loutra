import React from 'react';
import { useTranslation } from 'react-i18next';
import './HospitableBooking.css';

const HospitableBooking = () => {
    const { t } = useTranslation();

    return (
        <section id="book" className="section booking-section">
            <div className="container" data-reveal>
                <h2 className="section-title">{t('booking.title')}</h2>
                <div className="booking-frame">
                    <iframe
                        id="booking-iframe"
                        className="booking-iframe"
                        title="Booking"
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"
                        src="https://booking.hospitable.com/widget/a1fddc69-e603-4b37-95a3-4bfd6f25188a/2286458"
                    />
                </div>
            </div>
        </section>
    );
};

export default HospitableBooking;
