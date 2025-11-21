# Template Customization Guide

This guide explains how to customize the invoice and email templates to match your needs.

## Overview

The invoice processor uses **Handlebars templates** for all formatting, making it easy to customize:

✅ **Email Templates** - HTML with CSS styling, clickable links, and rich formatting
✅ **Invoice Templates** - HTML-based, easily adjustable layouts
✅ **Separation of Concerns** - Templates are separate from business logic

## Template Locations

All templates are in `src/templates/`:

```
src/templates/
├── email.html             # HTML email with StashAway signature
├── invoice-english.html   # English invoice page
└── invoice-polish.html    # Polish invoice page
```

## Customizing Email Templates

### Location
`src/templates/email.html`

### Features
- ✅ HTML formatting with CSS styles
- ✅ Clickable links (website, email, app stores)
- ✅ Emoji support
- ✅ Professional signature layout
- ✅ Responsive styling

### How to Customize

**1. Change Colors:**
```html
<!-- Find this in the template -->
<div style="border-top: 2px solid #1a73e8;">

<!-- Change to your brand color -->
<div style="border-top: 2px solid #FF6B00;">
```

**2. Add a Logo:**
```html
<!-- Add after the opening <body> tag -->
<div style="text-align: center; margin-bottom: 20px;">
  <img src="https://your-domain.com/logo.png" alt="Company Logo" style="max-width: 200px;">
</div>
```

**3. Modify Signature:**
```html
<!-- Current signature structure -->
<p class="name">{{personal.name}} {{personal.surname}}</p>
<p class="title">Staff Engineer</p>

<!-- Add more fields -->
<p class="name">{{personal.name}} {{personal.surname}}</p>
<p class="title">Staff Engineer</p>
<p class="title">Team: Engineering Excellence</p>
<p class="title">Department: Platform</p>
```

**4. Change Font:**
```html
<style>
  body {
    font-family: Arial, sans-serif;  /* Change this */
  }
</style>

<!-- Try: -->
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
font-family: Georgia, 'Times New Roman', serif;
font-family: 'Courier New', Courier, monospace;
```

### Available Variables

You can use these Handlebars variables in the email template:

- `{{month}}` - Invoice month (e.g., "November")
- `{{personal.name}}` - First name
- `{{personal.surname}}` - Last name
- `{{personal.email}}` - Email address
- `{{personal.phone}}` - Phone number

## Customizing Invoice Templates

### Locations
- `src/templates/invoice-english.html` (English version)
- `src/templates/invoice-polish.html` (Polish version)

### Features
- ✅ HTML + CSS layout (easy to adjust)
- ✅ Flexbox-based two-column design
- ✅ Table formatting for line items
- ✅ Professional styling with borders and colors

### How to Customize

**1. Change Table Colors:**
```css
/* In the <style> section */
th {
  background-color: #d3d3d3;  /* Table header color */
}

.total-row {
  background-color: #d3d3d3;  /* Total row color */
}

/* Try different colors: */
background-color: #4A90E2;  /* Blue */
background-color: #50C878;  /* Green */
background-color: #FFA500;  /* Orange */
```

**2. Adjust Layout Spacing:**
```css
/* Change margins between sections */
.header {
  margin-bottom: 30px;  /* Increase/decrease space */
}

.payment-terms {
  margin-top: 30px;  /* Adjust spacing */
}
```

**3. Modify Column Widths:**
```css
/* Current layout */
.left-column {
  flex: 1;
}
.right-column {
  flex: 1;
  padding-left: 50px;
}

/* Make right column narrower */
.left-column {
  flex: 2;  /* Takes 2/3 of space */
}
.right-column {
  flex: 1;  /* Takes 1/3 of space */
}
```

**4. Add Company Logo:**
```html
<!-- Add at the top of the invoice -->
<div class="header">
  <img src="path/to/logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
  <p>Thank you very much for your business.</p>
  ...
</div>
```

**5. Change Font Sizes:**
```css
body {
  font-family: Arial, sans-serif;
  margin: 40px;
  color: #000;
  font-size: 12px;  /* Base font size */
}

.invoice-title {
  font-size: 24px;  /* Make larger/smaller */
}
```

**6. Add Watermark:**
```html
<!-- Add before </body> -->
<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.1); z-index: -1;">
  PAID
</div>
```

### Available Variables

Invoice templates have access to:

**Invoice Data:**
- `{{invoiceNumber}}` - Invoice number (e.g., "21/11/2025")
- `{{invoiceDate}}` - Formatted date (e.g., "21.11.25")
- `{{total}}` - Total amount
- `{{currency}}` - Currency code (e.g., "SGD")

**Line Items (use with `{{#each}}`):**
```handlebars
{{#each lineItems}}
  <tr>
    <td>{{this.description}}</td>      <!-- English -->
    <td>{{this.descriptionPl}}</td>    <!-- Polish -->
    <td>{{this.amount}}</td>
  </tr>
{{/each}}
```

**Company Info:**
- `{{company.name}}` - Company name
- `{{company.address}}` - Street address
- `{{company.addressLine2}}` - Building/unit
- `{{company.city}}` - City
- `{{company.postalCode}}` - Postal code

**Personal Info:**
- `{{personal.name}}` - First name
- `{{personal.surname}}` - Last name
- `{{personal.email}}` - Email
- `{{personal.phone}}` - Phone

**Recipient Info:**
- `{{recipient.name}}` - Recipient name
- `{{recipient.address}}` - Address
- `{{recipient.nip}}` - Tax ID
- `{{recipient.regon}}` - Business registry

**Bank Details:**
- `{{bank.bankName}}` - Bank name
- `{{bank.bankAddress}}` - Bank address
- `{{bank.iban}}` - IBAN
- `{{bank.beneficiaryPassport}}` - Passport number
- `{{bank.bic}}` - BIC/SWIFT code

## PDF Generation

### Current Approach: PDFKit

The current implementation uses **PDFKit** with hardcoded coordinates. This works but is difficult to adjust.

**Location:** `src/generators/pdfGenerator.ts`

**Pros:**
- ✅ No external dependencies
- ✅ Fast generation
- ✅ Full control

**Cons:**
- ❌ Hardcoded X/Y coordinates (e.g., `.text('Invoice', 50, 200)`)
- ❌ Difficult to adjust layout
- ❌ Manual recalculation needed when adding fields

### Recommended: HTML-to-PDF Approach

For easier customization, consider switching to an HTML-to-PDF library:

**Option 1: Puppeteer** (recommended)
```bash
npm install puppeteer
```

**Option 2: html-pdf-node**
```bash
npm install html-pdf-node
```

**Benefits:**
- ✅ Use the same HTML templates for preview and PDF
- ✅ CSS-based layout (much easier to adjust)
- ✅ No coordinate calculations
- ✅ WYSIWYG - what you style is what you get

**Example Implementation:**
```typescript
import puppeteer from 'puppeteer';

async function generatePDFFromHTML(html: string, outputPath: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true
  });
  await browser.close();
}
```

## Making Layout Changes Easy

### Best Practices

1. **Use CSS Variables** for colors:
```css
:root {
  --primary-color: #1a73e8;
  --border-color: #d3d3d3;
  --text-color: #000;
}

th {
  background-color: var(--border-color);
}
```

2. **Use Flexbox** for responsive layouts:
```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
```

3. **Keep templates simple** - avoid inline styles when possible

4. **Test changes** by generating a sample invoice after each edit

## Testing Your Changes

After modifying templates, test them:

```bash
# Build the project
npm run build

# Generate a test invoice
npm run generate -- generate \
  --salary 100 \
  --bonus 100 \
  --month November \
  --output test-invoice.pdf

# Check the generated files:
# - test-invoice.pdf (PDF invoice)
# - test-invoice_email.txt (plain text email)
# - test-invoice_email.html (HTML email - open in browser to preview)
```

**Preview HTML email:**
```bash
# Open in your default browser
open test-invoice_email.html  # macOS
xdg-open test-invoice_email.html  # Linux
start test-invoice_email.html  # Windows
```

## Common Customization Tasks

### 1. Add a New Field to Invoice

**Step 1:** Add to config.json:
```json
{
  "personal": {
    "name": "John",
    "title": "Senior Engineer"  // NEW
  }
}
```

**Step 2:** Update TypeScript types (src/types/invoice.ts:5):
```typescript
export interface PersonalInfo {
  name: string;
  surname: string;
  title?: string;  // NEW - optional
  email: string;
  phone: string;
}
```

**Step 3:** Use in template:
```html
<p class="name">{{personal.name}} {{personal.surname}}</p>
{{#if personal.title}}
  <p class="title">{{personal.title}}</p>
{{/if}}
```

### 2. Change Invoice Number Format

**Location:** `src/index.ts:26`

```typescript
// Current format: "21/11/2025"
function generateInvoiceNumber(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

// Try these formats:
return format(date, 'yyyy-MM-dd');        // "2025-11-21"
return `INV-${format(date, 'yyyyMMdd')}`;  // "INV-20251121"
return `${format(date, 'yyyy')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;  // "2025-A4F2G8"
```

### 3. Add Tax Calculations

**Update types:**
```typescript
export interface InvoiceData {
  // ... existing fields
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}
```

**Update template:**
```html
<tr>
  <td>Subtotal</td>
  <td>{{subtotal}} {{currency}}</td>
</tr>
<tr>
  <td>Tax ({{taxRate}}%)</td>
  <td>{{taxAmount}} {{currency}}</td>
</tr>
<tr class="total-row">
  <td>TOTAL</td>
  <td>{{total}} {{currency}}</td>
</tr>
```

## Troubleshooting

**Problem: Changes not appearing**
- Solution: Run `npm run build` after every code change
- Check: Make sure you're editing the right template file

**Problem: Handlebars syntax errors**
- Solution: Check matching `{{#each}}...{{/each}}` and `{{#if}}...{{/if}}` blocks
- Validate: Use online Handlebars validator

**Problem: PDF layout broken**
- Solution: If using PDFKit, check X/Y coordinates don't overlap
- Better: Switch to HTML-to-PDF approach for easier layout management

**Problem: Email formatting issues**
- Solution: Test HTML email in multiple clients (Gmail, Outlook, etc.)
- Use: Tables for layout in emails for better compatibility

## Summary

### Easy to Customize ✅
- ✅ Email HTML templates (colors, fonts, layout)
- ✅ Invoice HTML templates (all styling via CSS)
- ✅ Add/remove fields by editing templates
- ✅ Change colors, fonts, spacing with CSS

### Requires More Work ⚠️
- ⚠️ PDFKit coordinate-based layout (consider switching to HTML-to-PDF)
- ⚠️ Adding complex business logic (requires TypeScript changes)

### Recommended Next Steps

1. **Customize email template** - easiest place to start
2. **Adjust invoice colors and fonts** - pure CSS changes
3. **Consider HTML-to-PDF migration** - for easier PDF customization long-term

Happy customizing! 🎨
