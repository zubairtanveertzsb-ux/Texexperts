import { TaxService, BusinessProfile, Appointment } from '../types';

export const TAX_SERVICES: TaxService[] = [
  {
    id: 'ntn-new-registration',
    slug: 'new-taxpayer-registration',
    title: 'New Taxpayer Registration (NTN)',
    category: 'Registration',
    popular: true,
    shortDescription: 'National Tax Number (NTN) generation for Individuals, Salaried persons, Sole Proprietorships & Partnerships.',
    fullDescription: 'Comprehensive taxpayer enrollment with the tax authority. Includes online registration, verification of CNIC and mobile SIM data, drafting of business activity details, and issuance of official Registration Certificate.',
    estimatedTurnaround: '24 – 48 Hours',
    standardFee: 2500,
    currency: 'PKR',
    deliverables: [
      'Official National Tax Number (NTN) Certificate',
      'IRIS / Tax Portal Online Account Creation',
      'User ID & PIN Credentials Setup',
      'Active Taxpayer status guidance'
    ],
    requiredDocuments: [
      {
        id: 'doc-cnic',
        name: 'CNIC / National Identity Card',
        description: 'Clear color photo or scanned copy of valid CNIC (Front and Back side)',
        isMandatory: true
      },
      {
        id: 'doc-sim',
        name: 'Active Mobile SIM on Applicant CNIC',
        description: 'Active mobile number registered in own name to receive instant OTP verification codes',
        isMandatory: true
      },
      {
        id: 'doc-email',
        name: 'Personal / Business Email Address',
        description: 'Active email account where tax portal activation links and PIN codes will arrive',
        isMandatory: true
      },
      {
        id: 'doc-util-bill',
        name: 'Latest Electricity / Utility Bill',
        description: 'Paid utility bill of residential or business premises (not older than 3 months)',
        isMandatory: true
      },
      {
        id: 'doc-biz-letterhead',
        name: 'Business Name & Letterhead (For Business NTN)',
        description: 'If registering a sole proprietorship, provide planned business title and blank letterhead copy',
        isMandatory: false
      },
      {
        id: 'doc-rent-deed',
        name: 'Premises Ownership / Rent Deed',
        description: 'Tenancy agreement or property title of the office or residential premises',
        isMandatory: false
      },
      {
        id: 'doc-bank-cert',
        name: 'Bank Account Maintenance Certificate',
        description: 'Letter or IBAN certificate from your bank confirming account title and IBAN',
        isMandatory: false
      }
    ]
  },
  {
    id: 'account-recovery',
    slug: 'account-recovery',
    title: 'Tax Account Recovery (IRIS / Portal)',
    category: 'Access Recovery',
    popular: true,
    shortDescription: 'Restore locked, disconnected, or compromised tax portal accounts when email or SIM is inaccessible.',
    fullDescription: 'Official recovery procedure for taxpayers who cannot access their IRIS / Tax Portal profile due to expired SIMs, changed phone numbers, inactive email inboxes, or previous consultant withholding login credentials.',
    estimatedTurnaround: '12 – 24 Hours',
    standardFee: 3000,
    currency: 'PKR',
    deliverables: [
      'Full recovery of primary Tax Portal account',
      'Update of registered Mobile Number & Email to current client details',
      'New secure Password and 4-digit PIN generation',
      'Audit of past tax filings history'
    ],
    requiredDocuments: [
      {
        id: 'doc-cnic-recovery',
        name: 'Original CNIC Copy (Front & Back)',
        description: 'Color scan or clear camera shot of applicant CNIC with clearly legible issuance date',
        isMandatory: true
      },
      {
        id: 'doc-new-sim',
        name: 'New Active Mobile Number (Registered on CNIC)',
        description: 'Must be on applicant’s own CNIC to link as the new official contact',
        isMandatory: true
      },
      {
        id: 'doc-new-email',
        name: 'Fresh Email Address',
        description: 'Secure personal email to receive the account recovery token',
        isMandatory: true
      },
      {
        id: 'doc-past-ack',
        name: 'Last Filed Tax Return Copy (If available)',
        description: 'Any previous filing acknowledgement or CPR challan number to speed up verification',
        isMandatory: false
      }
    ]
  },
  {
    id: 'forget-password',
    slug: 'forget-password-reset',
    title: 'Forgot Password & PIN Reset',
    category: 'Access Recovery',
    popular: false,
    shortDescription: 'Express password and transaction PIN code reset for immediate filing and tender deadlines.',
    fullDescription: 'Fast-track password retrieval and authorization code regeneration. Designed for taxpayers who have their active phone and email but have forgotten their master login password or e-filing transaction PIN.',
    estimatedTurnaround: '2 – 4 Hours (Express)',
    standardFee: 1500,
    currency: 'PKR',
    deliverables: [
      'Account Password reset & unlocked profile',
      'Regenerated 4-digit Confidential Transaction PIN',
      'Security credentials delivery via WhatsApp/SMS'
    ],
    requiredDocuments: [
      {
        id: 'doc-cnic-pwd',
        name: 'CNIC / Registration Number',
        description: '13-digit National Identity Card number',
        isMandatory: true
      },
      {
        id: 'doc-sim-live',
        name: 'Live Mobile Handset Available for OTP',
        description: 'Applicant must have phone with them to relay 6-digit OTP code received from tax portal',
        isMandatory: true
      },
      {
        id: 'doc-security-ans',
        name: 'Mother’s Maiden Name / Place of Birth (If asked)',
        description: 'Standard security question data as registered on National Database',
        isMandatory: false
      }
    ]
  },
  {
    id: 'income-tax-return',
    slug: 'income-tax-return-filing',
    title: 'Income Tax Return Filing (Salaried & Business)',
    category: 'Income Tax',
    popular: true,
    shortDescription: 'Annual income tax return preparation, wealth reconciliation statement, and Active Taxpayer status (ATL).',
    fullDescription: 'Complete annual tax compliance for salaried professionals, freelancers, commercial businesses, and associations of persons (AOP). Includes calculation of taxable income, tax credits, allowable deductions, and wealth statement reconciliation to safeguard against tax notices.',
    estimatedTurnaround: '2 – 3 Days',
    standardFee: 4500,
    currency: 'PKR',
    deliverables: [
      'Comprehensive Income Tax Computation Sheet',
      'Wealth Statement (Assets, Liabilities & Net Worth Reconciliation)',
      'Official E-Filed Tax Return Acknowledgement Form 114(1)',
      'Inclusion / Renewal on Active Taxpayer List (ATL)',
      '100% Tax filer withholding rebate benefits'
    ],
    requiredDocuments: [
      {
        id: 'doc-salary-cert',
        name: 'Annual Salary Certificate / Form 149 / Pay Slips',
        description: 'Employer statement showing gross salary, allowances, and tax deducted at source',
        isMandatory: true
      },
      {
        id: 'doc-bank-statements',
        name: 'Bank Account Statements (July 1 to June 30)',
        description: 'Full 12-month bank statements for all personal and business accounts',
        isMandatory: true
      },
      {
        id: 'doc-tax-deductions',
        name: 'Tax Deduction Certificates (WHT)',
        description: 'Mobile phone tax deduction certificate, vehicle token tax receipt, bank cash withdrawal/profit certificates',
        isMandatory: false
      },
      {
        id: 'doc-property-assets',
        name: 'Property & Vehicle Details (Bought or Sold)',
        description: 'Purchase/sale deeds, plot allocations, or vehicle registration numbers during the tax year',
        isMandatory: false
      },
      {
        id: 'doc-utility-wht',
        name: 'Paid Electricity & Gas Bills',
        description: 'Paid bills showing consumer numbers to claim withholding tax credits',
        isMandatory: false
      },
      {
        id: 'doc-expense-ledger',
        name: 'Personal / Household Annual Living Expenses',
        description: 'Estimated annual household expenses for wealth statement balancing',
        isMandatory: true
      }
    ]
  },
  {
    id: 'sales-tax-return',
    slug: 'sales-tax-return-filing',
    title: 'Sales Tax Return Filing (Monthly / Compliance)',
    category: 'Sales Tax',
    popular: false,
    shortDescription: 'Monthly sales tax annexure compilation, input tax adjustment, and Annex-C / Annex-A reconciliation.',
    fullDescription: 'Preparation and e-filing of monthly and quarterly sales tax returns for manufacturers, wholesalers, distributors, service providers, and retailers under provincial and federal sales tax acts.',
    estimatedTurnaround: '24 – 48 Hours',
    standardFee: 6000,
    currency: 'PKR',
    deliverables: [
      'Annexure-C (Sales Invoices Ledger)',
      'Annexure-A (Input Purchases Reconciliation)',
      'Sales Tax Return Form 26 / E-Filing Acknowledgement',
      'Electronic CPR Payment Challan (if net tax payable)'
    ],
    requiredDocuments: [
      {
        id: 'doc-sales-invoices',
        name: 'Sales Invoices / Delivery Notes Summary',
        description: 'Excel or invoice copies showing buyer STRN/NTN, invoice date, value excluding tax, and sales tax charged',
        isMandatory: true
      },
      {
        id: 'doc-purchase-invoices',
        name: 'Purchase Invoices from Active Registered Vendors',
        description: 'Vendor bills showing supplier STRN to claim allowable input tax credit',
        isMandatory: true
      },
      {
        id: 'doc-wht-sales',
        name: 'Sales Tax Withholding Deductions',
        description: 'Withholding tax certificates issued by corporate buyers or withholding agents',
        isMandatory: false
      },
      {
        id: 'doc-st-bank',
        name: 'Business Bank Statement for the Tax Month',
        description: 'Showing payment receipts and vendor settlement transactions',
        isMandatory: true
      }
    ]
  },
  {
    id: 'tax-exemption-compliance',
    slug: 'tax-exemption-certificates',
    title: 'Withholding Tax Exemption & Advisory',
    category: 'Compliance',
    popular: false,
    shortDescription: '153 / 152 exemption certificates, reply to tax assessment notices, and ATL activation.',
    fullDescription: 'Legal drafting and representation before tax authorities for reduced tax rate certificates, responding to non-filing compliance notices, and rectification of erroneous tax demands.',
    estimatedTurnaround: '3 – 5 Days',
    standardFee: 5000,
    currency: 'PKR',
    deliverables: [
      'Legal response drafting to official tax notice',
      'Section 153/159 Exemption Certificate filing',
      'Case status report & advisory recommendation'
    ],
    requiredDocuments: [
      {
        id: 'doc-notice-copy',
        name: 'Copy of Tax Notice / Letter',
        description: 'Official notice received from the tax office or IRIS system inbox',
        isMandatory: true
      },
      {
        id: 'doc-ntn-cert',
        name: 'Current NTN / Registration Order',
        description: 'Taxpayer profile snapshot or registration certificate',
        isMandatory: true
      },
      {
        id: 'doc-supporting-ledgers',
        name: 'Supporting Accounts / Ledger Justification',
        description: 'Audited accounts or contract agreements related to the query',
        isMandatory: false
      }
    ]
  }
];

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  firmName: 'Apex Tax & Legal Advisory',
  tagline: 'Authorized Tax Advocates & E-Filing Specialists',
  whatsAppNumber: '923001234567', // Standard international format without leading +
  displayWhatsApp: '+92 300 1234567',
  consultantName: 'Adv. Muhammad Zubair Tanveer',
  email: 'taxadvisory@apextax.com',
  address: 'Suite 402, Executive Financial Tower, Blue Area, Islamabad',
  workingHours: 'Mon - Sat: 09:30 AM – 07:30 PM (PKT)',
  defaultMessagePrefix: 'Assalam-o-Alaikum / Hello'
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'TL-2026-9214',
    clientName: 'Tariq Mehmood',
    clientPhone: '+92 321 4455889',
    clientEmail: 'tariq.mehmood@example.com',
    clientCnicOrTaxId: '35201-8974512-3',
    businessName: 'Mehmood Traders & Logistics',
    city: 'Lahore',
    serviceId: 'ntn-new-registration',
    serviceTitle: 'New Taxpayer Registration (NTN)',
    appointmentDate: '2026-10-08',
    timeSlot: '11:00 AM - 11:45 AM',
    consultationMode: 'WhatsApp Chat & Call',
    notes: 'Need business NTN registered for my new wholesale hardware shop. Need to open bank account by Friday.',
    status: 'Documents Awaiting',
    fee: 2500,
    paymentStatus: 'Advance Paid',
    assignedConsultant: 'Adv. Muhammad Zubair Tanveer',
    createdAt: '2026-10-07T08:15:00Z',
    updatedAt: '2026-10-07T08:30:00Z',
    lastWhatsAppContactAt: '2026-10-07T08:30:00Z',
    urgent: true,
    documentsChecklist: [
      { documentId: 'doc-cnic', documentName: 'CNIC Copy (Front & Back)', isProvided: true, receivedAt: '2026-10-07T08:25:00Z' },
      { documentId: 'doc-sim', documentName: 'Active Mobile SIM on CNIC', isProvided: true, receivedAt: '2026-10-07T08:25:00Z' },
      { documentId: 'doc-email', documentName: 'Email Address', isProvided: true, receivedAt: '2026-10-07T08:25:00Z' },
      { documentId: 'doc-util-bill', documentName: 'Electricity Bill of Shop', isProvided: false },
      { documentId: 'doc-biz-letterhead', documentName: 'Business Letterhead', isProvided: false }
    ]
  },
  {
    id: 'TL-2026-9215',
    clientName: 'Ayesha Siddiqui',
    clientPhone: '+92 333 7891234',
    clientEmail: 'ayesha.siddiqui@techcorp.pk',
    clientCnicOrTaxId: '42101-5612398-4',
    city: 'Karachi',
    serviceId: 'account-recovery',
    serviceTitle: 'Tax Account Recovery (IRIS / Portal)',
    appointmentDate: '2026-10-08',
    timeSlot: '02:30 PM - 03:15 PM',
    consultationMode: 'WhatsApp Chat & Call',
    notes: 'Lost access to my IRIS tax portal because my old Mobilink SIM was blocked. Current employer needs tax certificate urgently.',
    status: 'Pending Contact',
    fee: 3000,
    paymentStatus: 'Unpaid',
    assignedConsultant: 'Adv. Muhammad Zubair Tanveer',
    createdAt: '2026-10-07T08:45:00Z',
    updatedAt: '2026-10-07T08:45:00Z',
    urgent: true,
    documentsChecklist: [
      { documentId: 'doc-cnic-recovery', documentName: 'Original CNIC Copy', isProvided: true, receivedAt: '2026-10-07T08:45:00Z' },
      { documentId: 'doc-new-sim', documentName: 'New Active Mobile SIM', isProvided: false },
      { documentId: 'doc-new-email', documentName: 'Fresh Email Address', isProvided: true, receivedAt: '2026-10-07T08:45:00Z' }
    ]
  },
  {
    id: 'TL-2026-9212',
    clientName: 'Farhan Zaidi',
    clientPhone: '+92 301 9876543',
    clientEmail: 'f.zaidi@financials.com',
    clientCnicOrTaxId: '61101-1234567-9',
    city: 'Islamabad',
    serviceId: 'income-tax-return',
    serviceTitle: 'Income Tax Return Filing (Salaried & Business)',
    appointmentDate: '2026-10-09',
    timeSlot: '04:00 PM - 04:45 PM',
    consultationMode: 'WhatsApp Chat & Call',
    notes: 'Annual salary income PKR 4.2M with withholding tax deducted from mobile and car purchase. Wealth reconciliation required.',
    status: 'In Progress',
    fee: 4500,
    paymentStatus: 'Fully Paid',
    assignedConsultant: 'Adv. Muhammad Zubair Tanveer',
    createdAt: '2026-10-06T11:20:00Z',
    updatedAt: '2026-10-07T07:10:00Z',
    lastWhatsAppContactAt: '2026-10-07T07:10:00Z',
    urgent: false,
    documentsChecklist: [
      { documentId: 'doc-salary-cert', documentName: 'Annual Salary Certificate', isProvided: true, receivedAt: '2026-10-06T14:00:00Z' },
      { documentId: 'doc-bank-statements', documentName: '12-Month Bank Statement', isProvided: true, receivedAt: '2026-10-06T14:00:00Z' },
      { documentId: 'doc-tax-deductions', documentName: 'Car WHT & Mobile Tax Certificate', isProvided: true, receivedAt: '2026-10-06T15:20:00Z' },
      { documentId: 'doc-expense-ledger', documentName: 'Household Expenses Breakdown', isProvided: true, receivedAt: '2026-10-07T07:05:00Z' }
    ]
  },
  {
    id: 'TL-2026-9210',
    clientName: 'Usman Ali & Partners',
    clientPhone: '+92 345 6543210',
    clientEmail: 'usman@alipackaging.com',
    clientCnicOrTaxId: '33100-7654321-1',
    businessName: 'Ali Packaging Solutions',
    city: 'Faisalabad',
    serviceId: 'sales-tax-return',
    serviceTitle: 'Sales Tax Return Filing (Monthly / Compliance)',
    appointmentDate: '2026-10-07',
    timeSlot: '05:30 PM - 06:15 PM',
    consultationMode: 'In-Office Visit',
    notes: 'Monthly sales tax annexures Annex-C and Annex-A reconciliation for September 2026 before 18th due date.',
    status: 'Under Review',
    fee: 6000,
    paymentStatus: 'Fully Paid',
    assignedConsultant: 'Adv. Muhammad Zubair Tanveer',
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-07T06:00:00Z',
    lastWhatsAppContactAt: '2026-10-07T06:00:00Z',
    urgent: false,
    documentsChecklist: [
      { documentId: 'doc-sales-invoices', documentName: 'Sales Invoices Summary', isProvided: true, receivedAt: '2026-10-06T10:00:00Z' },
      { documentId: 'doc-purchase-invoices', documentName: 'Registered Vendor Invoices', isProvided: true, receivedAt: '2026-10-06T10:00:00Z' },
      { documentId: 'doc-st-bank', documentName: 'Bank Statement for September', isProvided: true, receivedAt: '2026-10-06T11:00:00Z' }
    ]
  },
  {
    id: 'TL-2026-9208',
    clientName: 'Dr. Shahbaz Khan',
    clientPhone: '+92 312 9012345',
    clientEmail: 'shahbaz.khan.md@gmail.com',
    clientCnicOrTaxId: '37405-2345678-5',
    city: 'Rawalpindi',
    serviceId: 'forget-password',
    serviceTitle: 'Forgot Password & PIN Reset',
    appointmentDate: '2026-10-06',
    timeSlot: '01:00 PM - 01:30 PM',
    consultationMode: 'WhatsApp Chat & Call',
    notes: 'Needed to file visa tax proof immediately. Password and 4-digit PIN reset requested.',
    status: 'Completed',
    fee: 1500,
    paymentStatus: 'Fully Paid',
    assignedConsultant: 'Adv. Muhammad Zubair Tanveer',
    createdAt: '2026-10-06T09:30:00Z',
    updatedAt: '2026-10-06T12:00:00Z',
    lastWhatsAppContactAt: '2026-10-06T12:00:00Z',
    urgent: false,
    documentsChecklist: [
      { documentId: 'doc-cnic-pwd', documentName: 'CNIC Number', isProvided: true, receivedAt: '2026-10-06T09:35:00Z' },
      { documentId: 'doc-sim-live', documentName: 'Live Mobile Handset Available', isProvided: true, receivedAt: '2026-10-06T09:40:00Z' }
    ]
  }
];

export const TIME_SLOTS: string[] = [
  '09:30 AM - 10:15 AM',
  '10:30 AM - 11:15 AM',
  '11:30 AM - 12:15 PM',
  '02:00 PM - 02:45 PM',
  '03:00 PM - 03:45 PM',
  '04:00 PM - 04:45 PM',
  '05:00 PM - 05:45 PM',
  '06:00 PM - 06:45 PM'
];
