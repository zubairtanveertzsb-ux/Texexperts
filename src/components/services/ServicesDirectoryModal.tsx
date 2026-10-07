import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaxService } from '../../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { sanitizePhoneForWhatsApp } from '../../utils/whatsapp';

export const ServicesDirectory: React.FC = () => {
  const { services, businessProfile, setActiveView, setPreselectedServiceId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Registration', 'Access Recovery', 'Income Tax', 'Sales Tax', 'Compliance'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const handleBookService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveView('booking');
  };

  const handleWhatsAppInquiry = (service: TaxService) => {
    const phone = sanitizePhoneForWhatsApp(businessProfile.whatsAppNumber);
    const text = encodeURIComponent(
      `Hello ${businessProfile.firmName}, I have a question about ${service.title}. Could you please guide me on documents and procedure?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title & Category Filter */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
          Compliance Catalog & Document Guidelines
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 text-balance">
          Tax Services & Required Documents Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Review our comprehensive scope of services, government document requirements, and turnaround schedules before booking your consultation.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-sky-100 shadow-xs hover:border-sky-300 hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-5"
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wide bg-sky-50 px-2 py-0.5 rounded">
                  {service.category}
                </span>
                <span className="text-xs font-semibold text-slate-900 tabular-nums">
                  Fee: PKR {service.standardFee.toLocaleString()}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {service.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {service.fullDescription}
              </p>

              {/* Turnaround & Deliverables */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Turnaround Time: <strong className="text-slate-800">{service.estimatedTurnaround}</strong></span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1.5">Official Deliverables:</span>
                  <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Documents Section */}
                <div className="mt-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Required Documents ({service.requiredDocuments.length})
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {service.requiredDocuments.map((doc, idx) => (
                      <div key={idx} className="text-slate-700 flex items-start gap-2">
                        <span className="text-slate-400 font-mono text-[10px] mt-0.5">{idx + 1}.</span>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-800">{doc.name}</span>
                          {doc.isMandatory ? (
                            <span className="ml-1.5 text-[10px] text-amber-700 font-semibold">(Mandatory)</span>
                          ) : (
                            <span className="ml-1.5 text-[10px] text-slate-400">(Optional)</span>
                          )}
                          <p className="text-[11px] text-slate-500 leading-tight">{doc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleWhatsAppInquiry(service)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Ask via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleBookService(service.id)}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
