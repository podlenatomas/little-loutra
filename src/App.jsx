import React, { Suspense, useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AmenitiesSection from './components/AmenitiesSection';
import MeaningSection from './components/MeaningSection';
import InfoSection from './components/InfoSection';
import GalleryGrid from './components/GalleryGrid';
import SurroundingsSection from './components/SurroundingsSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import Map from './components/Map';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';
import LegalModal from './components/LegalModal';
import ScrollProgress from './components/ScrollProgress';
import useDocumentLang from './hooks/useDocumentLang';
import useSmoothScroll from './hooks/useSmoothScroll';
import useReveal from './hooks/useReveal';

function App() {
    const [legalDoc, setLegalDoc] = useState(null);
    const openLegal = useCallback((key) => setLegalDoc(key), []);
    const closeLegal = useCallback(() => setLegalDoc(null), []);

    useDocumentLang();
    useSmoothScroll();
    useReveal();

    return (
        <ErrorBoundary>
            <div className="App">
                <Suspense fallback={<div style={{ padding: 48, textAlign: 'center' }}>Loading…</div>}>
                    <ScrollProgress />
                    <Header />
                    <main id="main">
                        <Hero />
                        <AmenitiesSection />
                        <InfoSection />
                        <GalleryGrid />
                        <MeaningSection />
                        <SurroundingsSection />
                        <PricingSection />
                        <FAQSection />
                        <Map />
                        <ReservationForm onOpenLegal={openLegal} />
                    </main>
                    <Footer onOpenLegal={openLegal} />
                    <CookieConsent onLearnMore={openLegal} />
                    <LegalModal docKey={legalDoc} onClose={closeLegal} />
                </Suspense>
            </div>
        </ErrorBoundary>
    );
}

export default App;
