import React, { useState } from 'react';
import { Appointment } from '../../types';
import { useApp } from '../../context/AppContext';
import { createClientBookingWhatsAppUrl } from '../../utils/whatsapp';
import { 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  ExternalLink, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  Check
} from 'lucide-react';

interface ConfirmationCardProps {
  appointment: Appointment;
  onBookAnother: () => void;
  onTrackCase: () => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  appointment,
  onBookAnother,
  onTrackCase
}) => {
  const { businessProfile, services } = useApp();
  const [copied, setCopied] = useState(false);

  const matchedService = services.find(s => s.id === appointment.serviceId) || services[0];
  const whatsAppUrl = createClientBookingWhatsAppUrl(appointment, matchedService, businessProfile);

  const handleCopySummary = () => {
    const text = `Tax Appointment Reference: #${appointment.id}\nService: ${appointment.serviceTitle}\nClient: ${appointment.clientName}\nDate: ${appointment.appointmentDate} at ${appointment.timeSlot}\nConsultant: ${businessProfile.consultantName}\nFirm: ${businessProfile.firmName} (${businessProfile.displayWhatsApp})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-sky-100 shadow-md shadow-sky-50 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-100">Appointment Confirmed</span>
              <h2 className="text-2xl font-bold tracking-tight">Booking Ref: #{appointment.id}</h2>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-sky-100 block">Assigned Advocate</span>
            <span className="text-sm font-semibold">{businessProfile.consultantName}</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Core Direct WhatsApp Action Callout */}
        <div className="p-5 sm:p-6 bg-emerald-50/90 border border-emerald-200 rounded-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Step 2: Connect on WhatsApp to Submit Documents
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Share your documents directly with our Tax Consultant
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Your appointment is logged in our system. Click below to open a pre-formatted chat with 
                our consultant <strong className="text-slate-800">({businessProfile.displayWhatsApp})</strong>. You can instantly send pictures or PDFs of your documents.
              </p>
            </div>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm shadow-emerald-200 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open WhatsApp & Send Docs</span>
              <ExternalLink className="w-4 h-4 text-emerald-200" />
            </a>
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-sky-50/50 rounded-xl border border-sky-100 text-sm">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Service Booked</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{appointment.serviceTitle}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">Client Name & Phone</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {appointment.clientName} <span className="text-slate-500 font-normal tabular-nums">({appointment.clientPhone})</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-xs text-slate-500 block">Date</span>
              <span className="font-medium text-slate-900 tabular-nums">{appointment.appointmentDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-xs text-slate-500 block">Time & Mode</span>
              <span className="font-medium text-slate-900">{appointment.timeSlot} · {appointment.consultationMode}</span>
            </div>
          </div>

          {appointment.clientCnicOrTaxId && (
            <div>
              <span className="text-xs text-slate-500 block">CNIC / NTN</span>
              <span className="font-mono text-xs font-semibold text-slate-800">{appointment.clientCnicOrTaxId}</span>
            </div>
          )}

          {appointment.businessName && (
            <div>
              <span className="text-xs text-slate-500 block">Business Entity</span>
              <span className="font-medium text-slate-800">{appointment.businessName}</span>
            </div>
          )}
        </div>

        {/* Required Documents Checklist for WhatsApp Submission */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900">Documents Checklist to Send on WhatsApp</h4>
            </div>
            <span className="text-xs text-slate-500">
              {matchedService.requiredDocuments.length} required items
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden text-xs sm:text-sm">
            {matchedService.requiredDocuments.map((doc, idx) => {
              const isChecked = appointment.documentsChecklist.some(d => d.documentId === doc.id && d.isProvided);
              return (
                <div key={doc.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        {doc.name}
                        {doc.isMandatory && (
                          <span className="ml-2 text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                    </div>
                  </div>
                  {isChecked ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      <Check className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 shrink-0">Send in chat</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Booking Info'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBookAnother}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-2"
            >
              Book Another Service
            </button>
            <button
              onClick={onTrackCase}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
            >
              <span>Track Live Case Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
