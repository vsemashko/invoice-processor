import PDFDocument from 'pdfkit';
import { InvoiceData, Config } from '../types/invoice';
import { format } from 'date-fns';
import * as fs from 'fs';

export class PDFGenerator {
  private doc: PDFKit.PDFDocument;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
  }

  private drawEnglishPage(invoiceData: InvoiceData): void {
    const { doc } = this;

    // Header text
    doc.fontSize(11)
       .text('Thank you very much for your business.', 50, 50)
       .text('According to our Service Agreement I charge the following items for my services', 50, 65)
       .text('rendered:', 50, 80);

    // Company address
    doc.fontSize(11)
       .text(this.config.company.name, 50, 110)
       .text(this.config.company.address, 50, 125)
       .text(this.config.company.addressLine2, 50, 140)
       .text(`${this.config.company.city} ${this.config.company.postalCode}`, 50, 155)
       .text(`Date: ${format(invoiceData.date, 'dd.MM.yy')}`, 50, 170);

    // Invoice title
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('Invoice', 50, 200)
       .font('Helvetica');

    // Right side info
    doc.fontSize(10)
       .text('Invoice number', 400, 200)
       .text(invoiceData.invoiceNumber, 400, 215)
       .text('Address', 400, 240)
       .text(this.config.recipient.address, 400, 255)
       .text('eMail', 400, 285)
       .fillColor('blue')
       .text(this.config.personal.email, 400, 300)
       .fillColor('black')
       .text('Recipient', 400, 325)
       .text(this.config.recipient.name, 400, 340)
       .text(`NIP ${this.config.recipient.nip}`, 400, 355)
       .text(`REGON ${this.config.recipient.regon}`, 400, 370);

    // Bank details
    doc.text('Bank details', 400, 400)
       .text(this.config.bank.bankName, 400, 415)
       .text(this.config.bank.bankAddress, 400, 430, { width: 150 })
       .text(`Beneficiary Passport Number:`, 400, 460)
       .text(this.config.bank.beneficiaryPassport, 400, 475)
       .text('IBAN:', 400, 490)
       .text(this.config.bank.iban, 400, 505)
       .text(`BIC: ${this.config.bank.bic}`, 400, 520);

    // Description of services table
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Description of services', 50, 230)
       .font('Helvetica');

    // Table
    const tableTop = 260;
    const col1X = 50;
    const col2X = 450;

    // Table header
    doc.fontSize(10)
       .rect(col1X, tableTop, 495, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .fillColor('black')
       .text('Description', col1X + 5, tableTop + 8)
       .text('Total', col2X + 5, tableTop + 8);

    // Table rows
    let currentY = tableTop + 25;
    invoiceData.lineItems.forEach((item) => {
      doc.rect(col1X, currentY, 400, 25)
         .stroke()
         .rect(450, currentY, 95, 25)
         .stroke()
         .text(item.description, col1X + 5, currentY + 8)
         .text(`${item.amount} ${invoiceData.currency}`, col2X + 5, currentY + 8);
      currentY += 25;
    });

    // Total row
    doc.rect(col1X, currentY, 400, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .rect(450, currentY, 95, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .fillColor('black')
       .font('Helvetica-Bold')
       .text('TOTAL', col1X + 5, currentY + 8)
       .text(`${invoiceData.total} ${invoiceData.currency}`, col2X + 5, currentY + 8)
       .font('Helvetica');

    // Payment terms
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Payment terms', 50, currentY + 50)
       .font('Helvetica')
       .fontSize(11)
       .text('Payment is due within 20 days of receipt of the invoice.', 50, currentY + 70);

    // Footer
    doc.text('Thank you for your trust and I am looking forward to further collaboration.', 50, currentY + 110)
       .text('Best regards', 50, currentY + 150)
       .font('Helvetica-Bold')
       .text(`${this.config.personal.name} ${this.config.personal.surname}`, 50, currentY + 180)
       .font('Helvetica');
  }

  private drawPolishPage(invoiceData: InvoiceData): void {
    const { doc } = this;

    doc.addPage();

    // Header text
    doc.fontSize(11)
       .text('Bardzo dziękuję za współpracę.', 50, 50)
       .text('Zgodnie z naszą Umową o świadczenie usług, naliczam następujące opłaty za', 50, 65)
       .text('moje usługi:', 50, 80);

    // Company address
    doc.fontSize(11)
       .text(this.config.company.name, 50, 110)
       .text(this.config.company.address, 50, 125)
       .text(this.config.company.addressLine2, 50, 140)
       .text(`${this.config.company.city} ${this.config.company.postalCode}`, 50, 155)
       .text(`Date: ${format(invoiceData.date, 'dd.MM.yy')}`, 50, 170);

    // Invoice title
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('Faktura', 50, 200)
       .font('Helvetica');

    // Right side info
    doc.fontSize(10)
       .text('Numer faktury', 400, 200)
       .text(invoiceData.invoiceNumber, 400, 215)
       .text('Adres', 400, 240)
       .text(this.config.recipient.address, 400, 255)
       .text('eMail', 400, 285)
       .fillColor('blue')
       .text(this.config.personal.email, 400, 300)
       .fillColor('black')
       .text('Odbiorca', 400, 325)
       .text(this.config.recipient.name, 400, 340)
       .text(`NIP ${this.config.recipient.nip}`, 400, 355)
       .text(`REGON ${this.config.recipient.regon}`, 400, 370);

    // Bank details
    doc.text('Dane bankowe', 400, 400)
       .text(this.config.bank.bankName, 400, 415)
       .text(this.config.bank.bankAddress, 400, 430, { width: 150 })
       .text(`Numer Paszportu Beneficjenta:`, 400, 460)
       .text(this.config.bank.beneficiaryPassport, 400, 475)
       .text('IBAN:', 400, 490)
       .text(this.config.bank.iban, 400, 505)
       .text(`BIC: ${this.config.bank.bic}`, 400, 520);

    // Description of services table
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Opis usług', 50, 230)
       .font('Helvetica');

    // Table
    const tableTop = 260;
    const col1X = 50;
    const col2X = 450;

    // Table header
    doc.fontSize(10)
       .rect(col1X, tableTop, 495, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .fillColor('black')
       .text('Opis', col1X + 5, tableTop + 8)
       .text('RAZEM', col2X + 5, tableTop + 8);

    // Table rows
    let currentY = tableTop + 25;
    invoiceData.lineItems.forEach((item) => {
      doc.rect(col1X, currentY, 400, 25)
         .stroke()
         .rect(450, currentY, 95, 25)
         .stroke()
         .text(item.descriptionPl, col1X + 5, currentY + 8)
         .text(`${item.amount} ${invoiceData.currency}`, col2X + 5, currentY + 8);
      currentY += 25;
    });

    // Total row
    doc.rect(col1X, currentY, 400, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .rect(450, currentY, 95, 25)
       .fillAndStroke('#d3d3d3', '#000000')
       .fillColor('black')
       .font('Helvetica-Bold')
       .text('RAZEM', col1X + 5, currentY + 8)
       .text(`${invoiceData.total} ${invoiceData.currency}`, col2X + 5, currentY + 8)
       .font('Helvetica');

    // Payment terms
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Warunki płatności', 50, currentY + 50)
       .font('Helvetica')
       .fontSize(11)
       .text('Płatność należy dokonać w ciągu 20 dni od otrzymania faktury.', 50, currentY + 70);

    // Footer
    doc.text('Dziękuję za zaufanie i czekam na dalszą współpracę.', 50, currentY + 110)
       .text('Z poważaniem', 50, currentY + 150)
       .font('Helvetica-Bold')
       .text(`${this.config.personal.name} ${this.config.personal.surname}`, 50, currentY + 180)
       .font('Helvetica');
  }

  public generate(invoiceData: InvoiceData, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(outputPath);

      stream.on('finish', () => resolve());
      stream.on('error', reject);

      this.doc.pipe(stream);

      // Draw both pages
      this.drawEnglishPage(invoiceData);
      this.drawPolishPage(invoiceData);

      this.doc.end();
    });
  }
}
