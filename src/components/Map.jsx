import React from 'react';
import { useTranslation } from 'react-i18next';
import './Map.css';

const Map = () => {
    const { t } = useTranslation();

    return (
        <section id="location" className="section map-section">
            <div className="container">
                <h2 className="section-title">{t('nav.location')}</h2>
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50325.32626574185!2d22.92383195!3d37.99424855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a0445d4481358b%3A0x400bd2ce2b98850!2sPerachora%20Loutrakiou%20203%2000!5e0!3m2!1sen!2sgr!4v1707166500000!5m2!1sen!2sgr"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Little Loutra Location"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Map;
