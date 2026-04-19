import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import './FAQSection.css';

const FAQSection = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(null);
    const items = t('faq.items', { returnObjects: true }) || [];

    return (
        <section id="faq" className="section faq-section">
            <div className="container faq-container">
                <h2 className="section-title" data-reveal>{t('faq.title')}</h2>
                <div className="faq-list">
                    {Array.isArray(items) && items.map((item, i) => {
                        const isOpen = open === i;
                        return (
                            <div
                                key={i}
                                className={`faq-item ${isOpen ? 'open' : ''}`}
                                data-reveal
                                data-reveal-delay={(i % 5) + 1}
                            >
                                <button
                                    type="button"
                                    className="faq-question"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-a-${i}`}
                                    onClick={() => setOpen(isOpen ? null : i)}
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown size={20} className="faq-chevron" aria-hidden="true" />
                                </button>
                                <div id={`faq-a-${i}`} className="faq-answer" role="region" hidden={!isOpen}>
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
