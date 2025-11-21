import { Config } from '../types/invoice';
import { format } from 'date-fns';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export class EmailGenerator {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public generateEmail(month: string): EmailTemplate {
    const { personal } = this.config;
    const fullName = `${personal.name} ${personal.surname}`;

    const subject = `${fullName} ${month} Invoice for Service`;

    const body = `Hello everyone,

Hope you are doing well. Please find attached the invoice for ${month}.

Best Regards,
${personal.name}

StashAway
${fullName}
Staff Engineer
StashAway
Phone & WhatsApp: ${personal.phone}
StashAway, 105 Cecil St, #14-01 The Octagon, Singapore 069534
www.stashaway.sg | ${personal.email}

Download on the App Store | Get it on Google Play`;

    return { subject, body };
  }

  public generatePlainTextEmail(month: string): string {
    const template = this.generateEmail(month);
    return `Subject: ${template.subject}

${template.body}`;
  }
}
