#!/usr/bin/env node

import { Command } from 'commander';
import { format } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { ImprovedPdfGenerator } from './generators/improvedPdfGenerator';
import { EmailGenerator } from './generators/emailGenerator';
import { Config, InvoiceData, InvoiceLineItem, InvoiceInput } from './types/invoice';

const program = new Command();

function loadConfig(): Config {
  const configPath = path.join(process.cwd(), 'config.json');

  if (!fs.existsSync(configPath)) {
    console.error('Error: config.json not found. Please copy config.example.json to config.json and fill in your details.');
    process.exit(1);
  }

  const configData = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configData) as Config;
}

function generateInvoiceNumber(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

function buildInvoiceData(input: InvoiceInput, config: Config): InvoiceData {
  const date = input.date || new Date();
  const currency = input.currency || 'SGD';
  const lineItems: InvoiceLineItem[] = [];
  let total = 0;

  // Add salary if provided
  if (input.salary !== undefined && input.salary > 0) {
    lineItems.push({
      description: 'Salary',
      descriptionPl: 'Wynagrodzenie',
      amount: input.salary
    });
    total += input.salary;
  }

  // Add bonus if provided
  if (input.bonus !== undefined && input.bonus > 0) {
    lineItems.push({
      description: 'Bonus',
      descriptionPl: 'Premia',
      amount: input.bonus
    });
    total += input.bonus;
  }

  // Add reimbursements if provided
  if (input.reimbursements && input.reimbursements.length > 0) {
    input.reimbursements.forEach((reimbursement) => {
      lineItems.push({
        description: reimbursement.description,
        descriptionPl: reimbursement.descriptionPl,
        amount: reimbursement.amount
      });
      total += reimbursement.amount;
    });
  }

  return {
    invoiceNumber: generateInvoiceNumber(date),
    date,
    lineItems,
    total,
    currency
  };
}

program
  .name('invoice-generator')
  .description('Generate bilingual invoices with email templates')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate an invoice PDF and email template')
  .option('-s, --salary <amount>', 'Salary amount', parseFloat)
  .option('-b, --bonus <amount>', 'Bonus amount', parseFloat)
  .option('-r, --reimbursement <items...>', 'Reimbursements in format "description:descriptionPl:amount"')
  .option('-d, --date <date>', 'Invoice date (YYYY-MM-DD)', (value) => new Date(value))
  .option('-c, --currency <currency>', 'Currency code (default: SGD)', 'SGD')
  .option('-m, --month <month>', 'Month name for email template (e.g., November)')
  .option('-o, --output <filename>', 'Output PDF filename', 'invoice.pdf')
  .action((options) => {
    try {
      const config = loadConfig();

      // Parse reimbursements
      const reimbursements: Array<{ description: string; descriptionPl: string; amount: number }> = [];
      if (options.reimbursement) {
        options.reimbursement.forEach((item: string) => {
          const parts = item.split(':');
          if (parts.length === 3) {
            reimbursements.push({
              description: parts[0],
              descriptionPl: parts[1],
              amount: parseFloat(parts[2])
            });
          }
        });
      }

      const invoiceInput: InvoiceInput = {
        salary: options.salary,
        bonus: options.bonus,
        reimbursements: reimbursements.length > 0 ? reimbursements : undefined,
        date: options.date,
        currency: options.currency
      };

      const invoiceData = buildInvoiceData(invoiceInput, config);

      // Generate PDF using improved layout system
      const pdfGenerator = new ImprovedPdfGenerator(config);
      const outputPath = path.join(process.cwd(), options.output);

      pdfGenerator.generate(invoiceData, outputPath).then(() => {
        console.log(`✓ Invoice PDF generated: ${outputPath}`);

        // Generate email templates
        if (options.month) {
          const emailGenerator = new EmailGenerator(config);

          // Generate plain text version
          const emailTemplate = emailGenerator.generatePlainTextEmail(options.month);
          const emailPath = outputPath.replace('.pdf', '_email.txt');
          fs.writeFileSync(emailPath, emailTemplate);
          console.log(`✓ Plain text email template: ${emailPath}`);

          // Generate HTML version
          const htmlTemplate = emailGenerator.generateHTMLEmail(options.month);
          const htmlEmailPath = outputPath.replace('.pdf', '_email.html');
          fs.writeFileSync(htmlEmailPath, htmlTemplate);
          console.log(`✓ HTML email template: ${htmlEmailPath}`);
        }

        console.log('\nInvoice Summary:');
        console.log(`  Invoice Number: ${invoiceData.invoiceNumber}`);
        console.log(`  Date: ${format(invoiceData.date, 'dd.MM.yyyy')}`);
        console.log(`  Total: ${invoiceData.total} ${invoiceData.currency}`);
        console.log('\nLine Items:');
        invoiceData.lineItems.forEach((item) => {
          console.log(`  - ${item.description}: ${item.amount} ${invoiceData.currency}`);
        });
      }).catch((error) => {
        console.error('Error generating PDF:', error);
        process.exit(1);
      });

    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse();
