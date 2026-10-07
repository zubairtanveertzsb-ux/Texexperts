import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaxService, ConsultationMode, ClientDocumentSubmission } from '../../types';
import { TIME_SLOTS } from '../../data/servicesData';
import { ConfirmationCard } from './ConfirmationCard';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  CreditCard, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const { 
    services, 
    businessProfile, 
    addAppointment, 
    latestBookedAppointment, 
    setLatestBookedAppointment,
    setActiveView,
    preselectedServiceId,
    setPreselectedServiceId
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || 'ntn-new-registration'
  );
  const [expandedDocsServiceId, setExpandedDocsServiceId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Step 2 State
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('WhatsApp Chat & Call');

  // Step 3 State
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientCnicOrTaxId, setClientCnicOrTaxId] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [urgent, setUrgent] = useState<boolean>(false);
  const [documentsReadiness, setDocumentsReadiness] = useState<Record<string, boolean>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      setPreselectedServiceId(null);
    }
  }, [preselectedServiceId, setPreselectedServiceId]);

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];

  // Initialize documents readiness when service changes
  useEffect(() => {
    if (currentService) {
      const initial: Record<string, boolean> = {};
      currentService.requiredDocuments.forEach(doc => {
        initial[doc.id] = true; // default assume they can gather it
      });
      setDocumentsReadiness(initial);
    }
  }, [selectedServiceId, currentService]);

  const handleNextStep1 = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!selectedDate) {
      setErrors({ date: 'Please select an appointment date' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!clientName.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!clientPhone.trim()) {
      newErrors.phone = 'Active WhatsApp phone number is required';
    } else if (clientPhone.replace(/\D/g, '').length < 9) {
      newErrors.phone = 'Please provide a valid phone number with country/area code';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const docsChecklist: ClientDocumentSubmission[] = currentService.requiredDocuments.map(doc => ({
      documentId: doc.id,
      documentName: doc.name,
      isProvided: !!documentsReadiness[doc.id]
    }));

    addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientCnicOrTaxId: clientCnicOrTaxId.trim() || undefined,
      businessName: businessName.trim() || undefined,
      city: city.trim() || undefined,
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      appointmentDate: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationMode,
      notes: notes.trim() || undefined,
      status: 'Pending Contact',
      documentsChecklist: docsChecklist,
      fee: currentService.standardFee,
      paymentStatus: 'Unpaid',
      assignedConsultant: businessProfile.consultantName,
      urgent
    });
  };

  const handleBookAnother = () => {
    setLatestBookedAppointment(null);
    setStep(1);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientCnicOrTaxId('');
    setBusinessName('');
    setNotes('');
  };

  if (latestBookedAppointment) {
    return (
      <div className="py-8 px-4 sm:px-6">
        <ConfirmationCard
          appointment={latestBookedAppointment}
          onBookAnother={handleBookAnother}
          onTrackCase={() => setActiveView('tracking')}
        />
      </div>
    );
  }

  const filteredServices = categoryFilter === 'all'
    ? services
    : services.filter(s => s.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Intro Hero Strip */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-sky-600 tracking-wider uppercase">
          Online Tax Advisory & Compliance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 text-balance">
          Book an Appointment & Submit Tax Documents
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Choose your tax service, pick a consultation slot, and immediately connect with our licensed advocates on WhatsApp to submit your documents securely.
        </p>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                step === 1 ? 'bg-sky-600 text-white font-semibold' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Select Service</span>
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => step > 2 && setStep(2)}
              disabled={step < 2}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                step === 2 
                  ? 'bg-sky-600 text-white font-semibold' 
                  : step > 2 
                  ? 'bg-sky-50 text-sky-700 hover:bg-sky-100' 
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Schedule & Mode</span>
            </button>
            <span className="text-slate-300">/</span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                step === 3 ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Client & Documents</span>
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: SERVICE SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 rounded-xl max-w-xl mx-auto">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'registration', label: 'NTN Registration' },
              { id: 'recovery', label: 'Account Recovery' },
              { id: 'income', label: 'Income Tax Return' },
              { id: 'sales', label: 'Sales Tax' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  categoryFilter === tab.id
                    ? 'bg-white text-sky-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map(service => {
              const isSelected = selectedServiceId === service.id;
              const isDocsExpanded = expandedDocsServiceId === service.id;

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-sky-500 shadow-md shadow-sky-100 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-sky-300 hover:shadow-xs'
                  }`}
                >
                  <div className="p-5 space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-600">
                          {service.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                          {service.title}
                        </h3>
                      </div>
                      {service.popular && (
                        <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Meta Specs */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Turnaround</span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                          {service.estimatedTurnaround}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Standard Fee</span>
                        <span className="font-semibold text-sky-700 tabular-nums">
                          {service.currency} {service.standardFee.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Required Documents Toggle */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDocsServiceId(isDocsExpanded ? null : service.id);
                        }}
                        className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{service.requiredDocuments.length} Required Documents</span>
                        {isDocsExpanded ? (
                          <ChevronUp className="w-3 h-3 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        )}
                      </button>

                      {isDocsExpanded && (
                        <div className="mt-2.5 p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs space-y-1.5">
                          <span className="font-semibold text-slate-800 block text-[11px]">
                            Checklist to send via WhatsApp:
                          </span>
                          <ul className="space-y-1 text-slate-600">
                            {service.requiredDocuments.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-sky-500 font-bold shrink-0">•</span>
                                <span className="text-[11px] leading-tight">
                                  {doc.name} {doc.isMandatory && <strong className="text-amber-700 font-medium">(*)</strong>}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Button */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Connect via WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNextStep1(service.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-xs hover:bg-sky-700'
                          : 'bg-white border border-slate-200 text-slate-800 hover:bg-sky-50 hover:text-sky-700'
                      }`}
                    >
                      <span>Select Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME & MODE */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-sky-100 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Selected Service</span>
              <h2 className="text-lg font-bold text-slate-900">{currentService.title}</h2>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>

          {/* Consultation Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Consultation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  mode: 'WhatsApp Chat & Call' as ConsultationMode,
                  title: 'WhatsApp Consultation',
                  desc: 'Fastest: Chat, send docs, voice/video call',
                  recommended: true,
                  icon: MessageCircle
                },
                {
                  mode: 'In-Office Visit' as ConsultationMode,
                  title: 'In-Office Visit',
                  desc: 'Consult in person at Islamabad office',
                  recommended: false,
                  icon: Building2
                },
                {
                  mode: 'Phone Call' as ConsultationMode,
                  title: 'Direct Phone Call',
                  desc: 'Standard mobile cellular call',
                  recommended: false,
                  icon: Phone
                }
              ].map(item => {
                const isChosen = consultationMode === item.mode;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setConsultationMode(item.mode)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isChosen
                        ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-1 ring-sky-600'
                        : 'border-slate-200 hover:border-sky-200 bg-white'
                    }`}
                  >
                    {item.recommended && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    )}
                    <IconComponent className={`w-5 h-5 mb-1.5 ${isChosen ? 'text-sky-600' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Appointment Date
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
              />
              <span className="text-xs text-slate-500">
                Operating Mon – Sat: 09:30 AM to 07:30 PM
              </span>
            </div>
            {errors.date && <p className="text-xs text-rose-600">{errors.date}</p>}
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Preferred Time Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors tabular-nums ${
                    selectedTimeSlot === slot
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep2}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <span>Next: Client Details & Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CLIENT DETAILS & DOCUMENT READINESS */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl border border-sky-100 shadow-xs p-6 sm:p-8 space-y-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Step 3 of 3</span>
              <h2 className="text-lg font-bold text-slate-900">Your Information & Documents Checklist</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Service: <strong className="text-slate-800">{currentService.title}</strong> · {selectedDate} ({selectedTimeSlot})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {/* Client Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.name ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                WhatsApp Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +92 300 1234567 or 03001234567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums ${
                  errors.phone ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.phone ? (
                <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-0.5">Documents will be exchanged on this number</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                CNIC or NTN Number (If available)
              </label>
              <input
                type="text"
                placeholder="e.g. 35201-1234567-1"
                value={clientCnicOrTaxId}
                onChange={(e) => setClientCnicOrTaxId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Business / Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Al-Madina Trading Co."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Islamabad, Lahore, Karachi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Interactive Document Readiness Pre-Checklist */}
          <div className="space-y-3 p-4 bg-sky-50/60 rounded-xl border border-sky-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Required Documents Checklist
                </span>
                <p className="text-[11px] text-slate-500">
                  Tick which documents you have ready to send over WhatsApp right after booking:
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {currentService.requiredDocuments.map(doc => {
                const isChecked = !!documentsReadiness[doc.id];
                return (
                  <label
                    key={doc.id}
                    className="flex items-start gap-3 p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setDocumentsReadiness(prev => ({
                          ...prev,
                          [doc.id]: e.target.checked
                        }));
                      }}
                      className="mt-0.5 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800">
                        {doc.name}
                        {doc.isMandatory && (
                          <span className="ml-1.5 text-[10px] text-amber-700 font-medium">
                            (Required)
                          </span>
                        )}
                      </span>
                      <p className="text-[11px] text-slate-500">{doc.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes & Urgency */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Specific Notes or Questions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention any past filing issues, tax notices, or urgent deadlines..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span>Mark as High Priority / Urgent Deadline (tender, visa, bank loan requirement)</span>
            </label>
          </div>

          {/* WhatsApp Direct Connect Notice */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block font-semibold">Immediate WhatsApp Connection:</strong>
              Once you click confirm, you will be given an instant button to launch WhatsApp with our consultant <strong className="text-slate-800">({businessProfile.displayWhatsApp})</strong> with your pre-filled booking ID and document checklist ready to send.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-xs flex items-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Connect on WhatsApp</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
