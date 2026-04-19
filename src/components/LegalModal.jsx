import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import './LegalModal.css';

const LAST_UPDATED = '2026-04-18';

const LegalModal = ({ docKey, onClose }) => {
    const { t } = useTranslation();
    const dialogRef = useRef(null);
    const prevFocusRef = useRef(null);

    useEffect(() => {
        if (!docKey) return;
        prevFocusRef.current = document.activeElement;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
            prevFocusRef.current?.focus?.();
        };
    }, [docKey, onClose]);

    if (!docKey) return null;

    const title = t(`legal.${docKey}.title`);
    const body = t(`legal.${docKey}.body`);

    return (
        <div className="legal-overlay" onClick={onClose}>
            <div
                className="legal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="legal-title"
                tabIndex={-1}
                ref={dialogRef}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="legal-header">
                    <h2 id="legal-title">{title}</h2>
                    <button type="button" className="legal-close" onClick={onClose} aria-label={t('a11y.closeLegal')}>
                        <X size={22} />
                    </button>
                </header>
                <div className="legal-body">
                    <p className="legal-updated">{t('legal.lastUpdated')}: {LAST_UPDATED}</p>
                    <p>{body}</p>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
