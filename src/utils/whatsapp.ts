import { Appointment, TaxService, BusinessProfile } from '../types';

/**
 * Sanitizes phone number to digits only for WhatsApp wa.me links
 * Handles Pakistani, international and localized numbers
 */
export function sanitizePhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  // If local Pakistani format like 03001234567, replace leading 0 with 92
  if (cleaned.startsWith('03') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Generates the official WhatsApp link when a client books an appointment
 * Pre-fills the message with Appointment ID, Client info, Service, and Document checklist
 */
export function createClientBookingWhatsAppUrl(
  appointment: Appointment,
  service: TaxService,
  business: BusinessProfile
): string {
  const targetPhone = sanitizePhoneForWhatsApp(business.whatsAppNumber);
  
  const docsList = service.requiredDocuments
    .map((doc, idx) => `  ${idx + 1}. ${doc.name} ${doc.isMandatory ? '(Required)' : '(Optional)'}`)
    .join('\n');

  const readyDocs = appointment.documentsChecklist
    .filter(d => d.isProvided)
    .map(d => `• ${d.documentName}`)
    .join('\n');

  const message = [
    `*TAX APPOINTMENT & SERVICE BOOKING*`,
    `Ref ID: *#${appointment.id}*`,
    `Firm: ${business.firmName}`,
    `--------------------------------------`,
    `*Client Name:* ${appointment.clientName}`,
    `*Phone:* ${appointment.clientPhone}`,
    appointment.clientCnicOrTaxId ? `*CNIC / NTN:* ${appointment.clientCnicOrTaxId}` : null,
    appointment.businessName ? `*Business:* ${appointment.businessName}` : null,
    `*Service Requested:* ${appointment.serviceTitle}`,
    `*Scheduled Date:* ${appointment.appointmentDate}`,
    `*Time Slot:* ${appointment.timeSlot}`,
    `*Consultation Mode:* ${appointment.consultationMode}`,
    `--------------------------------------`,
    `*Required Documents Checklist:*`,
    docsList,
    readyDocs ? `\n*Documents I have ready to share now:*\n${readyDocs}` : null,
    appointment.notes ? `\n*Client Note:* "${appointment.notes}"` : null,
    `--------------------------------------`,
    `Hello ${business.consultantName}, I have booked this appointment. I am sending this message along with my required documents and information for verification. Please guide me on next steps!`
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Pre-composed response templates for consultant/admin to reach out to clients
 */
export type WhatsAppTemplateKey = 
  | 'welcome_booking'
  | 'request_missing_docs'
  | 'otp_request'
  | 'status_in_progress'
  | 'completed_filing'
  | 'payment_reminder';

export interface WhatsAppTemplate {
  key: WhatsAppTemplateKey;
  label: string;
  description: string;
  getText: (app: Appointment, business: BusinessProfile) => string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    key: 'welcome_booking',
    label: 'Appointment Confirmation & Welcome',
    description: 'Acknowledge appointment booking and introduce consultant',
    getText: (app, business) => {
      return [
        `Assalam-o-Alaikum / Hello *${app.clientName}*,`,
        `This is *${business.consultantName}* from *${business.firmName}*.`,
        `We have received your appointment booking for *${app.serviceTitle}* (Booking Ref: #${app.id}).`,
        `Scheduled Date: *${app.appointmentDate}* at *${app.timeSlot}*.`,
        `Please share clear photos/PDFs of your required documents here on WhatsApp so our legal team can begin review immediately.`,
        `Thank you for trusting us with your tax matters!`
      ].join('\n\n');
    }
  },
  {
    key: 'request_missing_docs',
    label: 'Request Missing Documents',
    description: 'Ask client to send pending documents to proceed',
    getText: (app, business) => {
      const missing = app.documentsChecklist
        .filter(d => !d.isProvided)
        .map((d, i) => `${i + 1}. ${d.documentName}`)
        .join('\n');

      return [
        `Dear *${app.clientName}*,`,
        `Regarding your tax file *#${app.id}* (${app.serviceTitle}) with *${business.firmName}*:`,
        `We are currently reviewing your file. To proceed with the official submission, please send us the following missing documents here on WhatsApp:`,
        missing || `• Pending verification documents`,
        `You can reply with photos or PDF documents directly to this chat. Thank you!`
      ].join('\n\n');
    }
  },
  {
    key: 'otp_request',
    label: 'Request Live OTP / Verification Code',
    description: 'Prompt client for 6-digit portal verification code during active filing',
    getText: (app, business) => {
      return [
        `URGENT: Verification Code Needed`,
        `Dear *${app.clientName}*,`,
        `We are currently processing your *${app.serviceTitle}* on the official tax portal.`,
        `A 6-digit verification code (OTP) has been sent to your registered mobile number / email from FBR/IRIS.`,
        `Please reply immediately with this OTP so we can complete your verification before the code expires.`,
        `Best regards,\n${business.consultantName}`
      ].join('\n\n');
    }
  },
  {
    key: 'status_in_progress',
    label: 'Work In Progress Update',
    description: 'Inform client their tax return / registration is under active drafting',
    getText: (app, business) => {
      return [
        `Dear *${app.clientName}*,`,
        `Your case *#${app.id}* for *${app.serviceTitle}* is now *In Progress*.`,
        `Our tax advocates are preparing your documentation and wealth reconciliation statements.`,
        `We will notify you once draft copies are ready for your final approval.`,
        `Regards,\n${business.firmName}`
      ].join('\n\n');
    }
  },
  {
    key: 'completed_filing',
    label: 'Filing Completed & Certificate Ready',
    description: 'Congratulate client with completion acknowledgement and NTN / CPR',
    getText: (app, business) => {
      return [
        `Alhamdulillah / Great News! 🎉`,
        `Dear *${app.clientName}*,`,
        `Your *${app.serviceTitle}* (Ref: #${app.id}) has been successfully processed and submitted!`,
        `Official filing acknowledgement & tax documents are ready. Please find the attached copy / credentials above.`,
        `Your taxpayer status is now verified. Thank you for choosing *${business.firmName}*!`,
        `Feel free to recommend our services to your friends and colleagues.`
      ].join('\n\n');
    }
  },
  {
    key: 'payment_reminder',
    label: 'Invoice / Professional Fee Note',
    description: 'Share payment details and invoice status',
    getText: (app, business) => {
      return [
        `Dear *${app.clientName}*,`,
        `Here is the professional fee statement for your tax service *#${app.id}* (${app.serviceTitle}):`,
        `Service Fee: PKR ${app.fee.toLocaleString()} (${app.paymentStatus})`,
        `Bank / JazzCash / EasyPaisa transfer details:`,
        `Bank: Meezan Bank Ltd`,
        `Account Title: ${business.firmName}`,
        `IBAN: PK64MEZN0001000123456789`,
        `Once transferred, please share the screenshot/slip here. Thank you!`
      ].join('\n\n');
    }
  }
];

/**
 * Creates link for consultant to WhatsApp the client
 */
export function createConsultantToClientWhatsAppUrl(
  clientPhone: string,
  messageText: string
): string {
  const targetPhone = sanitizePhoneForWhatsApp(clientPhone);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;
}
