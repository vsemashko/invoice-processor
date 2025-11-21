import PDFDocument from 'pdfkit';
import { InvoiceData, Config } from '../types/invoice';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Improved PDF Generator with configurable layout
 *
 * This generator uses PDFKit with a configuration-based abstraction layer.
 * Layout is loaded from pdf-config.json, making it easy to adjust colors,
 * fonts, spacing, and margins without editing code or rebuilding.
 */

// Type definition for layout configuration
interface LayoutConfig {
  page: {
    margin: { top: number; bottom: number; left: number; right: number };
    width: number;
    height: number;
  };
  colors: {
    primary: string;
    secondary: string;
    link: string;
    tableHeader: string;
    tableBorder: string;
  };
  fonts: {
    regular: string;
    bold: string;
    sizes: {
      small: number;
      normal: number;
      large: number;
      title: number;
    };
  };
  spacing: {
    lineHeight: number;
    sectionGap: number;
    smallGap: number;
  };
}

/**
 * Load layout configuration from external pdf-config.json file
 */
function loadLayoutConfig(): LayoutConfig {
  // Try multiple possible locations for the config file
  const possiblePaths = [
    path.join(process.cwd(), 'pdf-config.json'),           // Project root (production)
    path.join(__dirname, '../../pdf-config.json'),         // From dist/ directory
    path.join(__dirname, '../../../pdf-config.json')       // Alternative location
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configData);
    }
  }

  // Fallback to default configuration if file not found
  console.warn('pdf-config.json not found, using default configuration');
  return {
    page: {
      margin: { top: 50, bottom: 50, left: 50, right: 50 },
      width: 595,
      height: 842
    },
    colors: {
      primary: '#000000',
      secondary: '#666666',
      link: 'blue',
      tableHeader: '#d3d3d3',
      tableBorder: '#000000'
    },
    fonts: {
      regular: 'Helvetica',
      bold: 'Helvetica-Bold',
      sizes: {
        small: 10,
        normal: 11,
        large: 14,
        title: 16
      }
    },
    spacing: {
      lineHeight: 15,
      sectionGap: 20,
      smallGap: 10
    }
  };
}

// Load layout configuration from external file
const LAYOUT = loadLayoutConfig();

export class ImprovedPdfGenerator {
  private doc: PDFKit.PDFDocument;
  private config: Config;
  private currentY: number;

  constructor(config: Config) {
    this.config = config;
    this.doc = new PDFDocument({
      size: 'A4',
      margins: LAYOUT.page.margin
    });
    this.currentY = LAYOUT.page.margin.top;
  }

  private moveCursor(distance: number): void {
    this.currentY += distance;
  }

  private resetCursor(): void {
    this.currentY = LAYOUT.page.margin.top;
  }

  private text(content: string, options: {
    fontSize?: number;
    font?: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
    x?: number;
  } = {}): void {
    const x = options.x || LAYOUT.page.margin.left;
    const fontSize = options.fontSize || LAYOUT.fonts.sizes.normal;
    const font = options.font || LAYOUT.fonts.regular;
    const color = options.color || LAYOUT.colors.primary;

    this.doc
      .font(font)
      .fontSize(fontSize)
      .fillColor(color)
      .text(content, x, this.currentY, {
        align: options.align || 'left',
        width: LAYOUT.page.width - LAYOUT.page.margin.left - LAYOUT.page.margin.right
      });

    this.moveCursor(LAYOUT.spacing.lineHeight);
  }

  private drawTable(data: { headers: string[], rows: any[][], totals?: any[] }): void {
    const tableX = LAYOUT.page.margin.left;
    const tableWidth = LAYOUT.page.width - LAYOUT.page.margin.left - LAYOUT.page.margin.right;
    const col1Width = tableWidth * 0.7;
    const col2Width = tableWidth * 0.3;
    const rowHeight = 25;

    // Draw header
    this.doc
      .rect(tableX, this.currentY, col1Width, rowHeight)
      .fillAndStroke(LAYOUT.colors.tableHeader, LAYOUT.colors.tableBorder)
      .fillColor(LAYOUT.colors.primary)
      .fontSize(LAYOUT.fonts.sizes.normal)
      .text(data.headers[0], tableX + 5, this.currentY + 8, { width: col1Width - 10 });

    this.doc
      .rect(tableX + col1Width, this.currentY, col2Width, rowHeight)
      .fillAndStroke(LAYOUT.colors.tableHeader, LAYOUT.colors.tableBorder)
      .fillColor(LAYOUT.colors.primary)
      .text(data.headers[1], tableX + col1Width + 5, this.currentY + 8, { width: col2Width - 10, align: 'right' });

    this.moveCursor(rowHeight);

    // Draw rows
    data.rows.forEach(row => {
      this.doc
        .rect(tableX, this.currentY, col1Width, rowHeight)
        .stroke(LAYOUT.colors.tableBorder)
        .fillColor(LAYOUT.colors.primary)
        .text(row[0], tableX + 5, this.currentY + 8, { width: col1Width - 10 });

      this.doc
        .rect(tableX + col1Width, this.currentY, col2Width, rowHeight)
        .stroke(LAYOUT.colors.tableBorder)
        .fillColor(LAYOUT.colors.primary)
        .text(row[1], tableX + col1Width + 5, this.currentY + 8, { width: col2Width - 10, align: 'right' });

      this.moveCursor(rowHeight);
    });

    // Draw totals if provided
    if (data.totals) {
      this.doc
        .rect(tableX, this.currentY, col1Width, rowHeight)
        .fillAndStroke(LAYOUT.colors.tableHeader, LAYOUT.colors.tableBorder)
        .fillColor(LAYOUT.colors.primary)
        .font(LAYOUT.fonts.bold)
        .text(data.totals[0], tableX + 5, this.currentY + 8, { width: col1Width - 10 });

      this.doc
        .rect(tableX + col1Width, this.currentY, col2Width, rowHeight)
        .fillAndStroke(LAYOUT.colors.tableHeader, LAYOUT.colors.tableBorder)
        .fillColor(LAYOUT.colors.primary)
        .text(data.totals[1], tableX + col1Width + 5, this.currentY + 8, { width: col2Width - 10, align: 'right' });

      this.doc.font(LAYOUT.fonts.regular);
      this.moveCursor(rowHeight);
    }
  }

  private drawSidebarInfo(invoiceData: InvoiceData, x: number, startY: number): void {
    let y = startY;
    const smallFont = LAYOUT.fonts.sizes.small;
    const lineHeight = 15;

    const drawInfo = (label: string, value: string) => {
      this.doc.fontSize(smallFont).font(LAYOUT.fonts.bold).text(label, x, y);
      y += lineHeight;
      this.doc.font(LAYOUT.fonts.regular).text(value, x, y, { width: 150 });
      y += lineHeight + 10;
    };

    drawInfo('Invoice number', invoiceData.invoiceNumber);
    drawInfo('Address', this.config.recipient.address);
    drawInfo('eMail', this.config.personal.email);
    drawInfo('Recipient', `${this.config.recipient.name}\nNIP ${this.config.recipient.nip}\nREGON ${this.config.recipient.regon}`);

    this.doc.fontSize(smallFont).font(LAYOUT.fonts.bold).text('Bank details', x, y);
    y += lineHeight;
    this.doc.font(LAYOUT.fonts.regular)
      .text(this.config.bank.bankName, x, y, { width: 150 })
      .text(this.config.bank.bankAddress, x, y + 15, { width: 150 })
      .text(`Beneficiary Passport Number:`, x, y + 45, { width: 150 })
      .text(this.config.bank.beneficiaryPassport, x, y + 60, { width: 150 })
      .text(`IBAN: ${this.config.bank.iban}`, x, y + 75, { width: 150 })
      .text(`BIC: ${this.config.bank.bic}`, x, y + 90, { width: 150 });
  }

  private drawEnglishPage(invoiceData: InvoiceData): void {
    this.resetCursor();

    // Header
    this.text('Thank you very much for your business.');
    this.text('According to our Service Agreement I charge the following items for my services');
    this.text('rendered:');
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Company info
    this.text(this.config.company.name);
    this.text(this.config.company.address);
    this.text(this.config.company.addressLine2);
    this.text(`${this.config.company.city} ${this.config.company.postalCode}`);
    this.text(`Date: ${format(invoiceData.date, 'dd.MM.yy')}`, { font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Save sidebar start position
    const sidebarX = 400;
    const sidebarY = this.currentY;

    // Invoice title
    this.text('Invoice', { fontSize: LAYOUT.fonts.sizes.title, font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.smallGap);

    // Description of services
    this.text('Description of services', { fontSize: LAYOUT.fonts.sizes.large, font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.smallGap);

    // Table
    const tableRows = invoiceData.lineItems.map(item => [
      item.description,
      `${item.amount} ${invoiceData.currency}`
    ]);

    this.drawTable({
      headers: ['Description', 'Total'],
      rows: tableRows,
      totals: ['TOTAL', `${invoiceData.total} ${invoiceData.currency}`]
    });

    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Payment terms
    this.text('Payment terms', { fontSize: LAYOUT.fonts.sizes.large, font: LAYOUT.fonts.bold });
    this.text('Payment is due within 20 days of receipt of the invoice.');
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Footer
    this.text('Thank you for your trust and I am looking forward to further collaboration.');
    this.moveCursor(LAYOUT.spacing.sectionGap);
    this.text('Best regards');
    this.moveCursor(LAYOUT.spacing.smallGap);
    this.text(`${this.config.personal.name} ${this.config.personal.surname}`, { font: LAYOUT.fonts.bold });

    // Draw sidebar
    this.drawSidebarInfo(invoiceData, sidebarX, sidebarY);
  }

  private drawPolishPage(invoiceData: InvoiceData): void {
    this.resetCursor();

    // Header
    this.text('Bardzo dziękuję za współpracę.');
    this.text('Zgodnie z naszą Umową o świadczenie usług, naliczam następujące opłaty za');
    this.text('moje usługi:');
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Company info
    this.text(this.config.company.name);
    this.text(this.config.company.address);
    this.text(this.config.company.addressLine2);
    this.text(`${this.config.company.city} ${this.config.company.postalCode}`);
    this.text(`Date: ${format(invoiceData.date, 'dd.MM.yy')}`, { font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Save sidebar start position
    const sidebarX = 400;
    const sidebarY = this.currentY;

    // Invoice title
    this.text('Faktura', { fontSize: LAYOUT.fonts.sizes.title, font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.smallGap);

    // Description of services
    this.text('Opis usług', { fontSize: LAYOUT.fonts.sizes.large, font: LAYOUT.fonts.bold });
    this.moveCursor(LAYOUT.spacing.smallGap);

    // Table
    const tableRows = invoiceData.lineItems.map(item => [
      item.descriptionPl,
      `${item.amount} ${invoiceData.currency}`
    ]);

    this.drawTable({
      headers: ['Opis', 'RAZEM'],
      rows: tableRows,
      totals: ['RAZEM', `${invoiceData.total} ${invoiceData.currency}`]
    });

    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Payment terms
    this.text('Warunki płatności', { fontSize: LAYOUT.fonts.sizes.large, font: LAYOUT.fonts.bold });
    this.text('Płatność należy dokonać w ciągu 20 dni od otrzymania faktury.');
    this.moveCursor(LAYOUT.spacing.sectionGap);

    // Footer
    this.text('Dziękuję za zaufanie i czekam na dalszą współpracę.');
    this.moveCursor(LAYOUT.spacing.sectionGap);
    this.text('Z poważaniem');
    this.moveCursor(LAYOUT.spacing.smallGap);
    this.text(`${this.config.personal.name} ${this.config.personal.surname}`, { font: LAYOUT.fonts.bold });

    // Draw sidebar
    this.drawSidebarInfo(invoiceData, sidebarX, sidebarY);
  }

  public generate(invoiceData: InvoiceData, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(outputPath);

      stream.on('finish', () => resolve());
      stream.on('error', reject);

      this.doc.pipe(stream);

      // Draw both pages
      this.drawEnglishPage(invoiceData);
      this.doc.addPage();
      this.drawPolishPage(invoiceData);

      this.doc.end();
    });
  }
}
