import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowUpRight } from 'lucide-react';
import './Map.css';

const GOOGLE_MAPS_URL = 'https://maps.google.com/?q=Mpoleti+6,+Loutraki,+Greece';
const EMBED_URL = 'https://maps.google.com/maps?q=Mpoleti+6,+Loutraki,+Greece&z=17&output=embed';

const Map = () => {
    const { t } = useTranslation();

    return (
        <section id="location" className="section map-section">
            <div className="container">
                <div className="map-head" data-reveal>
                    <div>
                        <h2 className="section-title text-left">{t('location.title')}</h2>
                        <div className="map-address">
                            <MapPin size={18} aria-hidden="true" />
                            <p className="map-address-line">{t('location.address')}</p>
                        </div>
                    </div>
                    <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-directions"
                    >
                        <span>{t('location.directions')}</span>
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                </div>

                <div className="map-container" data-reveal data-reveal-delay="1">
                    <iframe
                        src={EMBED_URL}
                        width="100%"
                        height="560"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                        title="Little Loutra, Mpoleti 6, Loutraki Perachora"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default Map;
