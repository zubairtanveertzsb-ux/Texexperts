import React, { useState } from 'react';
import { Appointment, AppointmentStatus, PaymentStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { WHATSAPP_TEMPLATES, WhatsAppTemplateKey, createConsultantToClientWhatsAppUrl } from '../../utils/whatsapp';
import { 
  X, 
  MessageCircle, 
  Check, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  Building2, 
  User, 
  Trash2, 
  Send, 
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment;
  onClose: () => void;
  initialOpenWhatsAppTab?: boolean;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose,
  initialOpenWhatsAppTab = false
}) => {
  const { 
    updateAppointmentStatus, 
    updateAppointment, 
    toggleDocumentReceived, 
    deleteAppointment, 
    businessProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'whatsapp'>(
    initialOpenWhatsAppTab ? 'whatsapp' : 'details'
  );

  const [selectedTemplateKey, setSelectedTemplateKey] = useState<WhatsAppTemplateKey>('welcome_booking');
  const [customMessage, setCustomMessage] = useState<string>(() => {
    const tpl = WHATSAPP_TEMPLATES.find(t => t.key === 'welcome_booking');
    return tpl ? tpl.getText(appointment, businessProfile) : '';
  });
  const [internalNotes, setInternalNotes] = useState<string>(appointment.notes || '');
  const [feeAmount, setFeeAmount] = useState<number>(appointment.fee);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTemplateSelect = (key: WhatsAppTemplateKey) => {
    setSelectedTemplateKey(key);
    const tpl = WHATSAPP_TEMPLATES.find(t => t.key === key);
    if (tpl) {
      setCustomMessage(tpl.getText(appointment, businessProfile));
    }
  };

  const handleLaunchWhatsApp = () => {
    const url = createConsultantToClientWhatsAppUrl(appointment.clientPhone, customMessage);
    updateAppointment(appointment.id, {
      lastWhatsAppContactAt: new Date().toISOString()
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotesAndFee = () => {
    updateAppointment(appointment.id, {
      notes: internalNotes,
      fee: feeAmount
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete appointment #${appointment.id} for ${appointment.clientName}?`)) {
      deleteAppointment(appointment.id);
      onClose();
    }
  };

  const statusOptions: AppointmentStatus[] = [
    'Pending Contact',
    'Documents Awaiting',
    'In Progress',
    'Under Review',
    'Completed',
    'Cancelled'
  ];

  const paymentOptions: PaymentStatus[] = ['Unpaid', 'Advance Paid', 'Fully Paid'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              #{appointment.id}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {appointment.clientName}
              </h2>
              <span className="text-xs text-slate-500">{appointment.serviceTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 border-b border-slate-100 flex items-center gap-4 text-xs font-medium bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Task & Document Management</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Quick Templates</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'details' ? (
            <>
              {/* Quick Status and Payment Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={appointment.status}
                    onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as AppointmentStatus)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={appointment.paymentStatus}
                    onChange={(e) => updateAppointment(appointment.id, { paymentStatus: e.target.value as PaymentStatus })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {paymentOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Service Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    onBlur={handleSaveNotesAndFee}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                  />
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                  Client & Filing Specifics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">WhatsApp Phone</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{appointment.clientPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Appointment Slot</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {appointment.appointmentDate} · {appointment.timeSlot}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Consultation Mode</span>
                    <span className="font-medium text-slate-800">{appointment.consultationMode}</span>
                  </div>

                  {appointment.clientCnicOrTaxId && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">CNIC / NTN</span>
                      <span className="font-mono font-medium text-slate-800">{appointment.clientCnicOrTaxId}</span>
                    </div>
                  )}

                  {appointment.businessName && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Business Title</span>
                      <span className="font-medium text-slate-800">{appointment.businessName}</span>
                    </div>
                  )}

                  {appointment.clientEmail && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Email</span>
                      <span className="font-medium text-slate-800">{appointment.clientEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Checklist Manager */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      Required Documents Verification Checklist
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Check off documents received from client on WhatsApp to update case progress.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-700 tabular-nums">
                    {appointment.documentsChecklist.filter(d => d.isProvided).length} of {appointment.documentsChecklist.length} received
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {appointment.documentsChecklist.map((doc) => (
                    <div
                      key={doc.documentId}
                      className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                    >
                      <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                        <input
                          type="checkbox"
                          checked={doc.isProvided}
                          onChange={() => toggleDocumentReceived(appointment.id, doc.documentId)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                        />
                        <div>
                          <span className={`font-semibold ${doc.isProvided ? 'text-slate-900 line-through text-slate-400' : 'text-slate-800'}`}>
                            {doc.documentName}
                          </span>
                          {doc.receivedAt && (
                            <span className="text-[10px] text-emerald-600 block">
                              Received {new Date(doc.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </label>

                      <div className="flex items-center gap-2">
                        {doc.isProvided ? (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            Received
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                            Awaiting
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                  Staff Internal Case Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  onBlur={handleSaveNotesAndFee}
                  placeholder="Record credentials created, challan CPR numbers, tax officer remarks..."
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Bottom Quick Triggers */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Response Hub</span>
                </button>
              </div>
            </>
          ) : (
            /* WHATSAPP RESPONSE TAB */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase">
                    Direct Client WhatsApp Messenger
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select a standardized response template below or edit the message directly. Clicking "Launch WhatsApp Chat" opens WhatsApp Web / Mobile directly to <strong className="text-slate-800">{appointment.clientPhone}</strong>.
                </p>
              </div>

              {/* Preset Templates Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Quick Response Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WHATSAPP_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.key}
                      type="button"
                      onClick={() => handleTemplateSelect(tpl.key)}
                      className={`p-2.5 rounded-lg border text-left transition-colors text-xs ${
                        selectedTemplateKey === tpl.key
                          ? 'border-emerald-600 bg-emerald-50/80 font-semibold text-emerald-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block font-bold">{tpl.label}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{tpl.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Message Preview / Custom Editor
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Launch Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Target: <strong className="text-slate-800">{appointment.clientPhone}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleLaunchWhatsApp}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Launch WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
