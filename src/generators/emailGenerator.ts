import { Config } from '../types/invoice';
import { TemplateRenderer } from '../utils/templateRenderer';

export interface EmailTemplate {
  subject: string;
  body: string;
  html: string;
}

export class EmailGenerator {
  private config: Config;
  private templateRenderer: TemplateRenderer;

  constructor(config: Config) {
    this.config = config;
    this.templateRenderer = new TemplateRenderer();
  }

  public generateEmail(month: string): EmailTemplate {
    const { personal } = this.config;
    const fullName = `${personal.name} ${personal.surname}`;

    const subject = `${fullName} ${month} Invoice for Service`;

    const templateData = {
      month,
      personal: this.config.personal
    };

    const { html, text } = this.templateRenderer.renderEmail(templateData);

    return { subject, body: text, html };
  }

  public generatePlainTextEmail(month: string): string {
    const template = this.generateEmail(month);
    return `Subject: ${template.subject}

${template.body}`;
  }

  public generateHTMLEmail(month: string): string {
    const template = this.generateEmail(month);
    return `Subject: ${template.subject}
Content-Type: text/html; charset=UTF-8

${template.html}`;
  }
}
