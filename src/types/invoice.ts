export interface InvoiceLineItem {
  description: string;
  descriptionPl: string;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  lineItems: InvoiceLineItem[];
  total: number;
  currency: string;
}

export interface PersonalInfo {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  addressLine2: string;
  city: string;
  postalCode: string;
}

export interface RecipientInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  nip: string;
  regon: string;
}

export interface BankDetails {
  bankName: string;
  bankAddress: string;
  iban: string;
  beneficiaryPassport: string;
  bic: string;
}

export interface Config {
  personal: PersonalInfo;
  company: CompanyInfo;
  recipient: RecipientInfo;
  bank: BankDetails;
}

export interface InvoiceInput {
  salary?: number;
  bonus?: number;
  reimbursements?: Array<{ description: string; descriptionPl: string; amount: number }>;
  date?: Date;
  currency?: string;
}
