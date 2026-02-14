import React, { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MeaningSection from './components/MeaningSection';
import InfoSection from './components/InfoSection';
import AmenitiesSection from './components/AmenitiesSection';
import GalleryGrid from './components/GalleryGrid';
import SurroundingsSection from './components/SurroundingsSection';
import Map from './components/Map';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Suspense fallback="Loading...">
        <Header />
        <main>
          <Hero />
          <MeaningSection />
          <InfoSection />
          <AmenitiesSection />
          <GalleryGrid />
          <SurroundingsSection />
          <Map />
          <ReservationForm />
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
