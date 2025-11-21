# Invoice Processor

Automated bilingual (English/Polish) invoice generator with email templates for service invoices.

## Features

- Generates professional PDF invoices with two pages (English and Polish)
- Automatic invoice numbering based on date
- Supports variable line items (salary, bonus, reimbursements)
- Creates **both HTML and plain text** email templates with StashAway signature
- **Template-based customization** - easy to adjust layouts, colors, and styling
- Configurable personal, company, recipient, and bank details
- Built with Handlebars templates for maximum flexibility

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the example config and fill in your details:
```bash
cp config.example.json config.json
```

4. Edit `config.json` with your personal information:
   - Personal details (name, email, phone)
   - Company details
   - Recipient details (client information)
   - Bank details

## Usage

Build the project first:
```bash
npm run build
```

### Basic Usage

Generate an invoice with salary only:
```bash
npm run generate -- generate --salary 100 --month November
```

### With Bonus

Generate an invoice with salary and bonus:
```bash
npm run generate -- generate --salary 100 --bonus 100 --month November
```

### With Reimbursements

Add reimbursements using the format `description:descriptionPl:amount`:
```bash
npm run generate -- generate --salary 100 --reimbursement "Travel Expenses:Zwroty kosztów podróży:50" --month November
```

### Multiple Line Items

Combine all types:
```bash
npm run generate -- generate \
  --salary 100 \
  --bonus 100 \
  --reimbursement "Travel Expenses:Zwroty kosztów podróży:50" \
  --reimbursement "Equipment:Sprzęt:30" \
  --month November \
  --output my-invoice.pdf
```

### Custom Date

Specify a custom invoice date:
```bash
npm run generate -- generate --salary 100 --date 2025-11-15 --month November
```

### Different Currency

Change the currency (default is SGD):
```bash
npm run generate -- generate --salary 1000 --currency EUR --month November
```

## Command Options

- `-s, --salary <amount>` - Salary amount
- `-b, --bonus <amount>` - Bonus amount
- `-r, --reimbursement <items...>` - Reimbursements in format "description:descriptionPl:amount"
- `-d, --date <date>` - Invoice date in YYYY-MM-DD format (defaults to today)
- `-c, --currency <currency>` - Currency code (default: SGD)
- `-m, --month <month>` - Month name for email template (e.g., "November")
- `-o, --output <filename>` - Output PDF filename (default: invoice.pdf)

## Output

The tool generates three files:

1. **Invoice PDF** (e.g., `invoice.pdf`) - Two-page bilingual invoice
2. **Plain Text Email** (e.g., `invoice_email.txt`) - Plain text email with subject and body
3. **HTML Email** (e.g., `invoice_email.html`) - Rich HTML email with styling, clickable links, and formatting

## Project Structure

```
invoice-processor/
├── src/
│   ├── types/
│   │   └── invoice.ts          # TypeScript type definitions
│   ├── generators/
│   │   ├── pdfGenerator.ts     # PDF generation logic
│   │   └── emailGenerator.ts   # Email template generation
│   ├── templates/              # Handlebars templates
│   │   ├── email.html          # HTML email template
│   │   ├── invoice-english.html # English invoice HTML
│   │   └── invoice-polish.html  # Polish invoice HTML
│   ├── utils/
│   │   └── templateRenderer.ts # Template rendering utilities
│   └── index.ts                # CLI entry point
├── config.json                 # Your configuration (not in git)
├── config.example.json         # Example configuration template
├── package.json
├── tsconfig.json
├── README.md                   # This file
└── TEMPLATE_CUSTOMIZATION.md   # Guide for customizing templates
```

## Configuration

The `config.json` file contains all your personal and business details:

```json
{
  "personal": {
    "name": "Your Name",
    "surname": "SURNAME",
    "email": "your.email@company.com",
    "phone": "+1234567890"
  },
  "company": {
    "name": "Company Name",
    "address": "Street Address",
    "addressLine2": "Building/Unit",
    "city": "City",
    "postalCode": "123456"
  },
  "recipient": {
    "name": "Client Name",
    "address": "Client Address",
    "city": "City, Country",
    "country": "Country",
    "nip": "Tax ID",
    "regon": "Business Registry Number"
  },
  "bank": {
    "bankName": "Bank Name",
    "bankAddress": "Bank Address",
    "iban": "IBAN Number",
    "beneficiaryPassport": "Passport Number",
    "bic": "BIC/SWIFT Code"
  }
}
```

## Template Customization

**All templates use Handlebars and are easy to customize!**

The system uses HTML templates with CSS styling, making it simple to:

✅ Change colors, fonts, and layout
✅ Add or remove fields
✅ Modify email signatures
✅ Adjust invoice formatting

### Quick Customization Examples

**Change email colors:**
Edit `src/templates/email.html` and modify the CSS:
```css
.signature .company {
  color: #1a73e8;  /* Change to your brand color */
}
```

**Adjust invoice table styling:**
Edit `src/templates/invoice-english.html`:
```css
th {
  background-color: #d3d3d3;  /* Change header color */
}
```

**See the full customization guide:** [TEMPLATE_CUSTOMIZATION.md](TEMPLATE_CUSTOMIZATION.md)

This guide includes:
- How to change layouts and styling
- Adding logos and images
- Modifying fields and data
- Best practices for template editing
- Common customization tasks

## Development

Run in development mode with ts-node:
```bash
npm run dev -- generate --salary 100 --month November
```

Build the TypeScript code:
```bash
npm run build
```

## Example Invoice

Based on the provided invoice images, this tool generates invoices with:

- Company header (Asia Wealth Platform Pte Ltd)
- Invoice date and number
- Description of services table with line items
- Total calculation
- Payment terms (20 days)
- Recipient and bank details
- Professional closing signature

Each invoice has two pages: one in English and one in Polish, maintaining consistency across both languages.

## License

MIT
