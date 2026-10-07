import React, { useState, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/booking/HeroBanner';
import { BookingWizard } from './components/booking/BookingWizard';
import { ServicesDirectory } from './components/services/ServicesDirectoryModal';
import { TrackCaseModal } from './components/tracking/TrackCaseModal';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SettingsModal } from './components/dashboard/SettingsModal';
import { Footer } from './components/Footer';

function MainContent() {
  const { activeView } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const handleScrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6faff] text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'booking' && (
          <div>
            <HeroBanner onScrollToBooking={handleScrollToBooking} />
            <div ref={bookingRef} id="booking-section" className="scroll-mt-20">
              <BookingWizard />
            </div>
          </div>
        )}

        {activeView === 'services' && (
          <div className="py-4">
            <ServicesDirectory />
          </div>
        )}

        {activeView === 'tracking' && (
          <div className="py-4">
            <TrackCaseModal />
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="py-2">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Settings Modal (Global) */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* Corporate Light Blue Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
