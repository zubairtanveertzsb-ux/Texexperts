export type ServiceCategory = 'Registration' | 'Access Recovery' | 'Income Tax' | 'Sales Tax' | 'Compliance';

export type AppointmentStatus = 
  | 'Pending Contact'
  | 'Documents Awaiting'
  | 'In Progress'
  | 'Under Review'
  | 'Completed'
  | 'Cancelled';

export type ConsultationMode = 'WhatsApp Chat & Call' | 'In-Office Visit' | 'Phone Call';

export type PaymentStatus = 'Unpaid' | 'Advance Paid' | 'Fully Paid';

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
}

export interface TaxService {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  estimatedTurnaround: string;
  standardFee: number;
  currency: string;
  popular?: boolean;
  requiredDocuments: RequiredDocument[];
  deliverables: string[];
}

export interface ClientDocumentSubmission {
  documentId: string;
  documentName: string;
  isProvided: boolean;
  receivedAt?: string;
  notes?: string;
}

export interface Appointment {
  id: string; // e.g. TL-2026-8421
  clientName: string;
  clientPhone: string; // e.g. +92 300 1234567
  clientEmail?: string;
  clientCnicOrTaxId?: string; // CNIC or NTN
  businessName?: string;
  city?: string;
  serviceId: string;
  serviceTitle: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM - 11:15 AM"
  consultationMode: ConsultationMode;
  notes?: string;
  status: AppointmentStatus;
  documentsChecklist: ClientDocumentSubmission[];
  fee: number;
  paymentStatus: PaymentStatus;
  assignedConsultant: string;
  createdAt: string;
  updatedAt: string;
  lastWhatsAppContactAt?: string;
  urgent?: boolean;
}

export interface BusinessProfile {
  firmName: string;
  tagline: string;
  whatsAppNumber: string; // formatted e.g. 923001234567 without plus or symbols
  displayWhatsApp: string; // e.g. "+92 300 1234567"
  consultantName: string;
  email: string;
  address: string;
  workingHours: string;
  defaultMessagePrefix: string;
}
