import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MessageCircle, FileText, CheckCircle2, ArrowRight, Clock, Award } from 'lucide-react';
import { sanitizePhoneForWhatsApp } from '../../utils/whatsapp';

// Generated visual assets
import heroImage from '../../assets/images/tax_advisory_hero_1791389474609.jpg';
import consultantAvatar from '../../assets/images/tax_consultant_avatar_1791389485410.jpg';

export const HeroBanner: React.FC<{ onScrollToBooking: () => void }> = ({ onScrollToBooking }) => {
  const { businessProfile, setActiveView } = useApp();

  const handleHelplineWhatsApp = () => {
    const phone = sanitizePhoneForWhatsApp(businessProfile.whatsAppNumber);
    const text = encodeURIComponent(`Hello ${businessProfile.firmName}, I want to consult regarding tax registration and filing.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border-b border-sky-100">
      {/* Subtle background mesh glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-sky-200 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-semibold text-sky-800">
                Official E-Filing Desk & Authorized Tax Advocates
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Tax Services Made Simple. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-800">
                Book Online & Connect via WhatsApp.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Fast, verified compliance for <strong>New Taxpayer Registration (NTN)</strong>, <strong>Tax Account Recovery</strong>, <strong>Forgot Password</strong>, and <strong>Income & Sales Tax Returns</strong>. Book your slot and directly send your required documents on WhatsApp to our senior tax advocate.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onScrollToBooking}
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs shadow-sky-200 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                <span>Book Appointment & Submit Docs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleHelplineWhatsApp}
                className="px-5 py-3.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Feature Bullets & Trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/70 text-xs">
              <div>
                <span className="font-bold text-slate-900 block text-sm sm:text-base tabular-nums">
                  24–48 Hours
                </span>
                <span className="text-slate-500 text-[11px]">Express Turnaround</span>
              </div>

              <div>
                <span className="font-bold text-slate-900 block text-sm sm:text-base tabular-nums">
                  100% ATL
                </span>
                <span className="text-slate-500 text-[11px]">Active Filer Status</span>
              </div>

              <div>
                <span className="font-bold text-slate-900 block text-sm sm:text-base tabular-nums">
                  Direct WhatsApp
                </span>
                <span className="text-slate-500 text-[11px]">Instant Document Upload</span>
              </div>
            </div>

          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-2xl border border-sky-100 shadow-xl shadow-sky-100/50 overflow-hidden relative group">
              
              {/* Hero Image */}
              <div className="h-56 sm:h-64 w-full relative overflow-hidden bg-sky-100">
                <img
                  src={heroImage}
                  alt="Tax Consultation Office Desk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[11px] font-semibold text-sky-200 block uppercase tracking-wider">
                    Chambers of Tax Law
                  </span>
                  <span className="text-base font-bold text-white block">
                    {businessProfile.firmName}
                  </span>
                </div>
              </div>

              {/* Consultant Card Segment */}
              <div className="p-4 sm:p-5 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={consultantAvatar}
                    alt={businessProfile.consultantName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-sky-200 shadow-2xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {businessProfile.consultantName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Lead Tax Advocate & Corporate Advisor
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      Available on WhatsApp · {businessProfile.displayWhatsApp}
                    </span>
                  </div>
                </div>

                <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 text-xs text-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-[11px]">Instant Document Verification upon Booking</span>
                  </div>
                  <button
                    onClick={() => setActiveView('services')}
                    className="text-[11px] font-bold text-sky-700 hover:underline"
                  >
                    View Docs &rarr;
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
