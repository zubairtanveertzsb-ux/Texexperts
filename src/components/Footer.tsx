import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { sanitizePhoneForWhatsApp } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { businessProfile, setActiveView } = useApp();

  const handleWhatsApp = () => {
    const phone = sanitizePhoneForWhatsApp(businessProfile.whatsAppNumber);
    const text = encodeURIComponent(`Hello ${businessProfile.firmName}, I want to consult regarding tax compliance.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-white border-t border-sky-100 text-xs text-slate-600 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Advocate */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Tax<span className="text-sky-600">Link</span> Advisory
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Specialized tax advocates & corporate compliance consultants. Seamless appointment scheduling with immediate WhatsApp document submission.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-800 block">Lead Tax Practitioner:</span>
              <span className="text-xs text-sky-700 font-medium">{businessProfile.consultantName}</span>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Key Tax Services
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-sky-600 transition-colors">
                  New Taxpayer Registration (NTN)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-sky-600 transition-colors">
                  Account Recovery (IRIS / Portal)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-sky-600 transition-colors">
                  Forget Password & PIN Reset
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-sky-600 transition-colors">
                  Income Tax Return Filing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-sky-600 transition-colors">
                  Sales Tax Return & Annexures
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Chambers Contact & WhatsApp */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Official Contact Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>{businessProfile.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{businessProfile.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{businessProfile.email}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{businessProfile.displayWhatsApp}</span>
            </button>
          </div>

          {/* Col 4: Client Self-Service & Assurance */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Client Portals
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveView('booking')}
                className="w-full text-left p-2.5 bg-sky-50/70 hover:bg-sky-100 rounded-lg border border-sky-100 font-semibold text-sky-800 transition-colors"
              >
                Book Tax Consultation &rarr;
              </button>
              <button
                onClick={() => setActiveView('tracking')}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 font-semibold text-slate-800 transition-colors"
              >
                Track Case / NTN Status &rarr;
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">
              Confidentiality guaranteed. All taxpayer data, credentials, and financial disclosures are handled according to legal advocate privilege.
            </p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {businessProfile.firmName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Official E-Filing Desk</span>
            <span>·</span>
            <span>WhatsApp Document Submission</span>
            <span>·</span>
            <span>Encrypted Records</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
