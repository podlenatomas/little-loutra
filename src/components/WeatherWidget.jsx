import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './WeatherWidget.css';

const LAT = 37.9942;
const LON = 22.9238;
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m&timezone=auto`;
const MARINE_URL = `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LON}&current=sea_surface_temperature&timezone=auto`;

const WeatherWidget = ({ variant = 'default' }) => {
    const { t } = useTranslation();
    const [state, setState] = useState({ air: null, sea: null, status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [w, m] = await Promise.all([
                    fetch(URL).then((r) => (r.ok ? r.json() : Promise.reject())),
                    fetch(MARINE_URL).then((r) => (r.ok ? r.json() : null)).catch(() => null)
                ]);
                if (cancelled) return;
                setState({
                    air: Math.round(w.current?.temperature_2m),
                    sea: m?.current?.sea_surface_temperature != null ? Math.round(m.current.sea_surface_temperature) : null,
                    status: 'ok'
                });
            } catch {
                if (!cancelled) setState((s) => ({ ...s, status: 'error' }));
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    if (state.status === 'loading') {
        return (
            <div className={`weather weather--${variant}`} aria-live="polite">
                <span className="weather-dot" aria-hidden="true" />
                <span className="weather-label">{t('weather.label')}</span>
                <span className="weather-values weather-skel">—</span>
            </div>
        );
    }
    if (state.status === 'error') return null;

    return (
        <div className={`weather weather--${variant}`} aria-live="polite">
            <span className="weather-dot" aria-hidden="true" />
            <span className="weather-label">{t('weather.label')}</span>
            <span className="weather-values">
                <span>{t('weather.air')} {state.air}°</span>
                {state.sea != null && (
                    <>
                        <span className="weather-sep" aria-hidden="true">·</span>
                        <span>{t('weather.sea')} {state.sea}°</span>
                    </>
                )}
            </span>
        </div>
    );
};

export default WeatherWidget;
