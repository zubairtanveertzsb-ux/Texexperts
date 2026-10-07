import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Calendar, FileText, CheckCircle2, ShieldCheck, Settings, Users } from 'lucide-react';
import { sanitizePhoneForWhatsApp } from '../utils/whatsapp';

export const Navbar: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const { activeView, setActiveView, appointments, businessProfile } = useApp();

  const pendingCount = appointments.filter(
    a => a.status === 'Pending Contact' || a.status === 'Documents Awaiting'
  ).length;

  const handleDirectWhatsApp = () => {
    const phone = sanitizePhoneForWhatsApp(businessProfile.whatsAppNumber);
    const text = encodeURIComponent(
      `Hello ${businessProfile.firmName}, I have a question regarding tax services and appointment booking.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('booking')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1 -m-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-sky-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                Tax<span className="text-sky-600">Link</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                E-Filing & Legal Desk
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveView('booking')}
            className={`transition-colors flex items-center gap-1.5 pb-1 ${
              activeView === 'booking'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => setActiveView('services')}
            className={`transition-colors flex items-center gap-1.5 pb-1 ${
              activeView === 'services'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tax Services & Checklist</span>
          </button>

          <button
            onClick={() => setActiveView('tracking')}
            className={`transition-colors flex items-center gap-1.5 pb-1 ${
              activeView === 'tracking'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Track My Case</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-colors flex items-center gap-1.5 pb-1 relative ${
              activeView === 'dashboard'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Task Desk</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-sky-100 text-sky-700 text-xs font-semibold rounded-md tabular-nums">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDirectWhatsApp}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Helpline</span>
          </button>

          {activeView === 'dashboard' ? (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Configure firm WhatsApp number and details"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Desk Settings</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-sky-100 bg-sky-50/50 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveView('booking')}
          className={`px-2.5 py-1.5 rounded-md font-medium ${
            activeView === 'booking' ? 'bg-sky-600 text-white' : 'text-slate-600'
          }`}
        >
          Book
        </button>
        <button
          onClick={() => setActiveView('services')}
          className={`px-2.5 py-1.5 rounded-md font-medium ${
            activeView === 'services' ? 'bg-sky-600 text-white' : 'text-slate-600'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveView('tracking')}
          className={`px-2.5 py-1.5 rounded-md font-medium ${
            activeView === 'tracking' ? 'bg-sky-600 text-white' : 'text-slate-600'
          }`}
        >
          Track Case
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1 ${
            activeView === 'dashboard' ? 'bg-sky-600 text-white' : 'text-slate-600'
          }`}
        >
          Task Desk
          {pendingCount > 0 && (
            <span className="w-4 h-4 bg-sky-200 text-sky-800 rounded-full text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
