import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import { sanitizePhoneForWhatsApp, createConsultantToClientWhatsAppUrl } from '../../utils/whatsapp';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const TrackCaseModal: React.FC = () => {
  const { appointments, businessProfile, setActiveView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedAppointment, setMatchedAppointment] = useState<Appointment | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const termClean = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const found = appointments.find(app => {
      const idClean = app.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const phoneClean = app.clientPhone.replace(/[^0-9]/g, '');
      const cnicClean = (app.clientCnicOrTaxId || '').replace(/[^0-9]/g, '');
      
      return idClean.includes(termClean) || phoneClean.includes(termClean) || (cnicClean && cnicClean.includes(termClean));
    });

    setMatchedAppointment(found || null);
    setSearched(true);
  };

  const getStatusStepIndex = (status: AppointmentStatus): number => {
    switch (status) {
      case 'Pending Contact': return 1;
      case 'Documents Awaiting': return 2;
      case 'In Progress': return 3;
      case 'Under Review': return 4;
      case 'Completed': return 5;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const activeStep = matchedAppointment ? getStatusStepIndex(matchedAppointment.status) : 1;

  const handleSendMissingDocsWhatsApp = () => {
    if (!matchedAppointment) return;
    const missingDocs = matchedAppointment.documentsChecklist
      .filter(d => !d.isProvided)
      .map(d => `• ${d.documentName}`)
      .join('\n');

    const message = [
      `*STATUS UPDATE & DOCUMENTS FOR CASE #${matchedAppointment.id}*`,
      `Service: ${matchedAppointment.serviceTitle}`,
      `Client: ${matchedAppointment.clientName}`,
      `--------------------------------------`,
      `Hello ${businessProfile.consultantName}, I am following up on my case status.`,
      missingDocs ? `I am attaching the remaining documents now:\n${missingDocs}` : 'Please let me know if any other document is required.',
      `Thank you!`
    ].join('\n\n');

    const targetPhone = sanitizePhoneForWhatsApp(businessProfile.whatsAppNumber);
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
          Client Transparency Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Track Your Tax Case & Document Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Enter your Reference ID (e.g. <span className="font-mono font-medium text-slate-800">TL-2026-9214</span>) or registered WhatsApp phone number to check live processing status.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Booking ID (e.g. TL-2026-9214) or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors shrink-0"
          >
            Track Status
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Quick check demo:</span>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('TL-2026-9214');
              const found = appointments.find(a => a.id === 'TL-2026-9214');
              setMatchedAppointment(found || null);
              setSearched(true);
            }}
            className="text-sky-600 hover:underline font-mono"
          >
            #TL-2026-9214 (NTN)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('TL-2026-9212');
              const found = appointments.find(a => a.id === 'TL-2026-9212');
              setMatchedAppointment(found || null);
              setSearched(true);
            }}
            className="text-sky-600 hover:underline font-mono"
          >
            #TL-2026-9212 (Tax Return)
          </button>
        </div>
      </div>

      {/* Results View */}
      {searched && (
        <>
          {matchedAppointment ? (
            <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      #{matchedAppointment.id}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">Booked {new Date(matchedAppointment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{matchedAppointment.serviceTitle}</h2>
                  <p className="text-xs text-slate-600">Client: <strong>{matchedAppointment.clientName}</strong> · Phone: <span className="tabular-nums">{matchedAppointment.clientPhone}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Current Status</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md inline-block mt-0.5 ${
                      matchedAppointment.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : matchedAppointment.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800'
                        : matchedAppointment.status === 'Documents Awaiting'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {matchedAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Flow Stepper */}
              <div className="py-2">
                <span className="text-xs font-bold text-slate-700 block mb-4 uppercase tracking-wider">
                  Workflow Milestones
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { step: 1, label: '1. Booked', desc: 'Appointment logged' },
                    { step: 2, label: '2. Docs Check', desc: 'WhatsApp collection' },
                    { step: 3, label: '3. In Progress', desc: 'Drafting & legal audit' },
                    { step: 4, label: '4. Review', desc: 'Client confirmation' },
                    { step: 5, label: '5. Completed', desc: 'Filing & Certificate' }
                  ].map((s) => {
                    const isDone = activeStep >= s.step;
                    const isCurrent = activeStep === s.step;
                    return (
                      <div
                        key={s.step}
                        className={`p-3 rounded-xl border text-left sm:text-center transition-colors ${
                          isDone
                            ? 'bg-sky-50/80 border-sky-300 text-sky-900 font-semibold'
                            : 'bg-slate-50/40 border-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-2 ring-sky-500' : ''}`}
                      >
                        <div className="flex sm:justify-center items-center gap-1.5 mb-1">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                              {s.step}
                            </div>
                          )}
                          <span className="text-xs font-bold">{s.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-tight">{s.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Document Status Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Document Verification Checklist
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {matchedAppointment.documentsChecklist.filter(d => d.isProvided).length} of {matchedAppointment.documentsChecklist.length} received
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {matchedAppointment.documentsChecklist.map((doc, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        {doc.isProvided ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-800">{doc.documentName}</span>
                          {doc.receivedAt && (
                            <span className="text-[10px] text-slate-400 block">
                              Verified on {new Date(doc.receivedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {doc.isProvided ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Received & Verified
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Pending on WhatsApp
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps & WhatsApp Help Box */}
              <div className="p-4 sm:p-5 bg-sky-50/60 rounded-xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">
                    Have more documents or questions?
                  </span>
                  <p className="text-xs text-slate-600">
                    Your assigned consultant is <strong>{businessProfile.consultantName}</strong> ({businessProfile.displayWhatsApp}). Send photos or PDFs directly to our official WhatsApp chat.
                  </p>
                </div>

                <button
                  onClick={handleSendMissingDocsWhatsApp}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Docs on WhatsApp</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No Booking Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find an appointment matching "{searchTerm}". Please check your Reference ID or registered phone number.
              </p>
              <button
                onClick={() => setActiveView('booking')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg"
              >
                Book a New Appointment
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
