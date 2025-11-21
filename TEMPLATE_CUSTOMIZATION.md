# Template Customization Guide

This guide explains how to customize the email templates and PDF configuration for invoices.

## Overview

The invoice processor uses **two different approaches** for customization:

✅ **Email Templates** - True HTML/CSS templates using Handlebars, no rebuild required
⚠️ **PDF Configuration** - JSON configuration for styling, TypeScript for layout (rebuild required for layout changes)

## Template Locations

### Email Templates
```
src/templates/
└── email.html             # HTML email with signature
```

### PDF Configuration
```
pdf-config.json            # PDF styling configuration (colors, fonts, spacing)
src/generators/
└── improvedPdfGenerator.ts # PDF layout and structure
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
- ✅ No rebuild required

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

### Testing Email Templates

**Preview in browser:**
1. Edit `src/templates/email.html`
2. Open the file in a web browser
3. See changes immediately (use sample data for {{variables}})

**No rebuild needed!** Just edit the HTML and save.

## Customizing PDF Invoices

### Overview

PDFs use a **configuration-based system** with two levels:

1. **Styling** (easy): Edit `pdf-config.json` - no rebuild required
2. **Layout** (advanced): Edit `src/generators/improvedPdfGenerator.ts` - rebuild required

### PDF Styling Configuration

**Location:** `pdf-config.json`

**What you can customize without rebuilding:**
- Colors (text, table headers, borders)
- Font sizes
- Spacing and gaps
- Page margins

**Example - Change colors:**
```json
{
  "colors": {
    "primary": "#2C3E50",
    "tableHeader": "#3498DB",
    "tableBorder": "#2C3E50"
  }
}
```

**Example - Adjust font sizes:**
```json
{
  "fonts": {
    "sizes": {
      "small": 11,
      "normal": 12,
      "large": 16,
      "title": 20
    }
  }
}
```

**Example - Modify spacing:**
```json
{
  "spacing": {
    "lineHeight": 18,
    "sectionGap": 30,
    "smallGap": 15
  }
}
```

**After editing:** Just save and run the invoice generator. No rebuild needed!

### PDF Layout Changes (Advanced)

For layout changes (table structure, sections, positioning):

**Location:** `src/generators/improvedPdfGenerator.ts`

**What requires TypeScript editing:**
- Table column widths
- Row heights
- Adding/removing sections
- Repositioning elements
- Adding logos or images

**After editing:** Run `npm run build`

See [PDF_CUSTOMIZATION.md](./PDF_CUSTOMIZATION.md) for detailed PDF customization guide.

## Handlebars Syntax Reference

Both email templates use Handlebars templating:

### Variables
```handlebars
{{variableName}}           <!-- Simple variable -->
{{object.property}}        <!-- Nested property -->
```

### Conditionals
```handlebars
{{#if condition}}
  Content shown if true
{{else}}
  Content shown if false
{{/if}}
```

### Loops
```handlebars
{{#each items}}
  <div>{{this.name}}</div>
{{/each}}
```

### Comments
```handlebars
{{! This is a comment }}
```

## Best Practices

### Email Templates
1. ✅ Test in multiple email clients (Gmail, Outlook, Apple Mail)
2. ✅ Use inline CSS styles for better compatibility
3. ✅ Keep total email size under 100KB
4. ✅ Use web-safe fonts (Arial, Helvetica, Georgia, Times, Courier)
5. ✅ Include alt text for images
6. ✅ Test with real data before sending

### PDF Configuration
1. ✅ Make small changes and test incrementally
2. ✅ Keep backup of original `pdf-config.json`
3. ✅ Use valid JSON (no trailing commas, proper quotes)
4. ✅ Use hex color codes (#RRGGBB) for consistency
5. ✅ Test font sizes with longest content
6. ✅ Ensure margins don't cause content overflow

## Testing Your Changes

### Test Email Template
```bash
# Generate test invoice to see email output
npm start
```

The email HTML will be logged to console for verification.

### Test PDF Configuration
```bash
# Generate test invoice
npm start

# Check the generated PDF
# - Invoice-2024-11-21.pdf
```

## Comparison: Email vs PDF Customization

| Feature | Email Templates | PDF Generation |
|---------|----------------|----------------|
| **Format** | HTML/CSS | JSON config + TypeScript |
| **Styling changes** | Edit HTML/CSS | Edit `pdf-config.json` |
| **Layout changes** | Edit HTML | Edit TypeScript |
| **Rebuild for styling** | ❌ No | ❌ No (JSON config) |
| **Rebuild for layout** | ❌ No | ✅ Yes |
| **Preview** | Open in browser | Generate PDF |
| **Skills needed** | HTML/CSS | JSON (basic), TypeScript (advanced) |
| **Designer-friendly** | ✅ Yes | ⚠️ For colors/fonts only |
| **True templates** | ✅ Yes | ❌ No (config-based) |

## Troubleshooting

### Email Template Issues

**Problem: Variables not rendering**
- Solution: Check variable names match config.ts data structure
- Example: Use `{{personal.name}}` not `{{name}}`

**Problem: Styling broken in some email clients**
- Solution: Use inline styles instead of `<style>` tags
- Use web-safe fonts and simple layouts

**Problem: Links not clickable**
- Solution: Ensure proper `<a href="...">` tags
- Use full URLs with `https://` or `mailto:`

### PDF Configuration Issues

**Problem: Config changes not appearing**
- Solution: Check `pdf-config.json` is in project root
- Verify JSON is valid (use JSON validator)
- Check console for config load warnings

**Problem: PDF layout broken**
- Solution: Restore original config values
- Verify numbers are positive
- Check margins aren't too large for page size

**Problem: Text overlapping**
- Solution: Increase `lineHeight` or `sectionGap`
- Reduce font sizes
- Increase page margins

## Advanced Customization

### Multi-Language Support

Email templates already support multi-language via variables:
```handlebars
{{#if language.polish}}
  Dziękuję za współpracę
{{else}}
  Thank you for your business
{{/if}}
```

### Conditional Sections

Add conditional content based on data:
```handlebars
{{#if hasBonus}}
  <p>Congratulations on your bonus!</p>
{{/if}}
```

### Custom Styling Per Client

You can create multiple config files:
```bash
pdf-config-client1.json
pdf-config-client2.json
pdf-config-default.json
```

Then load the appropriate one in your code.

## Migration Notes

### Previous HTML Invoice Templates

Earlier versions had `invoice-english.html` and `invoice-polish.html` templates, but these were not used for PDF generation. They have been removed in favor of the configuration-based approach.

**Why the change?**
- HTML-to-PDF libraries require external dependencies (browsers, renderers)
- Configuration-based approach works in all environments
- No external dependencies or network requirements
- Styling can still be customized via JSON config

**For true template-based PDFs:**
This would require HTML-to-PDF libraries like Puppeteer, which need browser environments. The current config-based approach is a good compromise for environments where those dependencies aren't available.

## Summary

### Email Templates ✅
- **True HTML/CSS templates**
- Edit `src/templates/email.html`
- No rebuild needed
- Preview in browser
- Designer-friendly

### PDF Configuration ⚠️
- **Config-based system**
- Edit `pdf-config.json` for styling (no rebuild)
- Edit TypeScript for layout (rebuild required)
- Good for colors/fonts/spacing
- Advanced changes need coding

For detailed PDF customization, see [PDF_CUSTOMIZATION.md](./PDF_CUSTOMIZATION.md).
