import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export class TemplateRenderer {
  private templatesDir: string;

  constructor() {
    // Check if we're in development (src) or production (dist)
    const srcTemplates = path.join(__dirname, '../templates');
    const distTemplates = path.join(__dirname, '../../src/templates');

    // Use the one that exists
    if (fs.existsSync(srcTemplates)) {
      this.templatesDir = srcTemplates;
    } else if (fs.existsSync(distTemplates)) {
      this.templatesDir = distTemplates;
    } else {
      // Fallback to src templates relative to project root
      this.templatesDir = path.join(process.cwd(), 'src/templates');
    }
  }

  public render(templateName: string, data: any): string {
    const templatePath = path.join(this.templatesDir, templateName);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);

    return template(data);
  }

  public renderEmail(data: any): { html: string; text: string } {
    const html = this.render('email.html', data);

    // Generate plain text version from HTML
    const text = html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
      .trim();

    return { html, text };
  }
}
