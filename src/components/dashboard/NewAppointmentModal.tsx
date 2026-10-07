import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsultationMode, AppointmentStatus } from '../../types';
import { TIME_SLOTS } from '../../data/servicesData';
import { X, CheckCircle2 } from 'lucide-react';

export const NewAppointmentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { services, businessProfile, addAppointment } = useApp();

  const [serviceId, setServiceId] = useState(services[0]?.id || 'ntn-new-registration');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCnicOrTaxId, setClientCnicOrTaxId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('WhatsApp Chat & Call');
  const [status, setStatus] = useState<AppointmentStatus>('Pending Contact');
  const [notes, setNotes] = useState('');
  const [fee, setFee] = useState<number>(services[0]?.standardFee || 2500);

  const selectedService = services.find(s => s.id === serviceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please enter Client Name and WhatsApp Phone Number');
      return;
    }

    const docsChecklist = selectedService.requiredDocuments.map(doc => ({
      documentId: doc.id,
      documentName: doc.name,
      isProvided: false
    }));

    addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientCnicOrTaxId: clientCnicOrTaxId.trim() || undefined,
      businessName: businessName.trim() || undefined,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      appointmentDate,
      timeSlot,
      consultationMode,
      notes: notes.trim() || undefined,
      status,
      documentsChecklist: docsChecklist,
      fee,
      paymentStatus: 'Unpaid',
      assignedConsultant: businessProfile.consultantName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Walk-in / Phone Client</h2>
            <p className="text-xs text-slate-500">Log a new tax client directly into the workflow desk</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Service</label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                const s = services.find(x => x.id === e.target.value);
                if (s) setFee(s.standardFee);
              }}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.currency} {s.standardFee})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Ullah"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone *</label>
              <input
                type="text"
                required
                placeholder="e.g. +92 300 1234567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 tabular-nums"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">CNIC or NTN (Optional)</label>
              <input
                type="text"
                placeholder="35201-..."
                value={clientCnicOrTaxId}
                onChange={(e) => setClientCnicOrTaxId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Name (Optional)</label>
              <input
                type="text"
                placeholder="Business entity title"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 tabular-nums"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              >
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Consultation Mode</label>
              <select
                value={consultationMode}
                onChange={(e) => setConsultationMode(e.target.value as ConsultationMode)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              >
                <option value="WhatsApp Chat & Call">WhatsApp Chat & Call</option>
                <option value="In-Office Visit">In-Office Visit</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              >
                <option value="Pending Contact">Pending Contact</option>
                <option value="Documents Awaiting">Documents Awaiting</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Client remarks or deadline requirements..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-xs"
            >
              Create Booking
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
