# PDF Customization Guide

## Overview

The invoice generator now uses an **improved PDFKit generator** with a configurable layout system. This makes PDF customization **much easier** than before!

## Key Improvement: Configuration-Based Layout

Instead of hardcoded X/Y coordinates scattered throughout the code, all layout settings are now centralized in a `LAYOUT` configuration object at the top of the generator file.

### Location
`src/generators/improvedPdfGenerator.ts`

## Easy Customizations

### 1. Change Colors

**Location:** `src/generators/improvedPdfGenerator.ts` (lines 19-24)

```typescript
const LAYOUT = {
  colors: {
    primary: '#000000',        // Main text color
    secondary: '#666666',      // Secondary text
    link: 'blue',              // Links
    tableHeader: '#d3d3d3',    // Table header background
    tableBorder: '#000000'     // Table borders
  },
  // ... rest of config
};
```

**Example - Change table header to blue:**
```typescript
tableHeader: '#4A90E2',  // Blue instead of gray
```

**Example - Use your brand colors:**
```typescript
const LAYOUT = {
  colors: {
    primary: '#2C3E50',        // Dark blue-gray
    secondary: '#95A5A6',      // Light gray
    link: '#3498DB',           // Bright blue
    tableHeader: '#3498DB',    // Match link color
    tableBorder: '#2C3E50'     // Dark borders
  },
};
```

### 2. Adjust Fonts

**Location:** `src/generators/improvedPdfGenerator.ts` (lines 25-33)

```typescript
const LAYOUT = {
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    sizes: {
      small: 10,     // Sidebar info
      normal: 11,    // Body text
      large: 14,     // Section headings
      title: 16      // Page title
    }
  },
};
```

**Example - Make text larger:**
```typescript
sizes: {
  small: 11,      // +1
  normal: 12,     // +1
  large: 16,      // +2
  title: 20       // +4
}
```

**Available fonts in PDFKit:**
- `Helvetica` / `Helvetica-Bold` / `Helvetica-Oblique`
- `Times-Roman` / `Times-Bold` / `Times-Italic`
- `Courier` / `Courier-Bold` / `Courier-Oblique`

### 3. Modify Spacing

**Location:** `src/generators/improvedPdfGenerator.ts` (lines 34-38)

```typescript
const LAYOUT = {
  spacing: {
    lineHeight: 15,      // Space between lines
    sectionGap: 20,      // Space between sections
    smallGap: 10         // Small gaps
  }
};
```

**Example - More breathing room:**
```typescript
spacing: {
  lineHeight: 18,      // More space between lines
  sectionGap: 30,      // Larger section gaps
  smallGap: 15         // Bigger small gaps
}
```

**Example - Compact layout:**
```typescript
spacing: {
  lineHeight: 12,      // Tighter
  sectionGap: 15,      // Less space
  smallGap: 8          // Minimal gaps
}
```

### 4. Adjust Page Margins

**Location:** `src/generators/improvedPdfGenerator.ts` (lines 13-18)

```typescript
const LAYOUT = {
  page: {
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    },
    width: 595,   // A4 width in points
    height: 842   // A4 height in points
  },
};
```

**Example - Larger margins:**
```typescript
margin: {
  top: 70,
  bottom: 70,
  left: 70,
  right: 70
}
```

**Example - Asymmetric margins (for binding):**
```typescript
margin: {
  top: 50,
  bottom: 50,
  left: 80,    // More space on left for binding
  right: 50
}
```

### 5. Modify Table Layout

**Location:** `src/generators/improvedPdfGenerator.ts` (lines 91-95)

```typescript
private drawTable(data: { headers: string[], rows: any[][], totals?: any[] }): void {
  const tableX = LAYOUT.page.margin.left;
  const tableWidth = LAYOUT.page.width - LAYOUT.page.margin.left - LAYOUT.page.margin.right;
  const col1Width = tableWidth * 0.7;  // 70% for description
  const col2Width = tableWidth * 0.3;  // 30% for amount
  const rowHeight = 25;
```

**Example - More space for amounts:**
```typescript
const col1Width = tableWidth * 0.65;  // 65% for description
const col2Width = tableWidth * 0.35;  // 35% for amount
```

**Example - Taller rows:**
```typescript
const rowHeight = 30;  // More vertical space
```

## Complete Customization Examples

### Example 1: Modern Blue Theme

```typescript
const LAYOUT = {
  page: {
    margin: { top: 60, bottom: 60, left: 60, right: 60 },
    width: 595,
    height: 842
  },
  colors: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    link: '#3498DB',
    tableHeader: '#3498DB',
    tableBorder: '#2C3E50'
  },
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    sizes: {
      small: 11,
      normal: 12,
      large: 16,
      title: 20
    }
  },
  spacing: {
    lineHeight: 16,
    sectionGap: 25,
    smallGap: 12
  }
};
```

### Example 2: Professional Gray Theme

```typescript
const LAYOUT = {
  page: {
    margin: { top: 50, bottom: 50, left: 50, right: 50 },
    width: 595,
    height: 842
  },
  colors: {
    primary: '#333333',
    secondary: '#666666',
    link: '#0066CC',
    tableHeader: '#E8E8E8',
    tableBorder: '#CCCCCC'
  },
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    sizes: {
      small: 10,
      normal: 11,
      large: 13,
      title: 16
    }
  },
  spacing: {
    lineHeight: 15,
    sectionGap: 20,
    smallGap: 10
  }
};
```

### Example 3: Compact Layout

```typescript
const LAYOUT = {
  page: {
    margin: { top: 40, bottom: 40, left: 40, right: 40 },
    width: 595,
    height: 842
  },
  colors: {
    primary: '#000000',
    secondary: '#555555',
    link: 'blue',
    tableHeader: '#DDDDDD',
    tableBorder: '#000000'
  },
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    sizes: {
      small: 9,
      normal: 10,
      large: 12,
      title: 14
    }
  },
  spacing: {
    lineHeight: 12,
    sectionGap: 15,
    smallGap: 8
  }
};
```

## Advanced Customizations

### Adding a Logo

To add a company logo, modify the `drawEnglishPage()` and `drawPolishPage()` methods:

```typescript
private drawEnglishPage(invoiceData: InvoiceData): void {
  this.resetCursor();

  // ADD THIS: Logo
  this.doc.image('path/to/logo.png', LAYOUT.page.margin.left, this.currentY, {
    width: 100
  });
  this.moveCursor(60); // Space for logo

  // Rest of the page...
  this.text('Thank you very much for your business.');
  // ...
}
```

### Changing Text Alignment

The `text()` method supports alignment:

```typescript
// Center align
this.text('INVOICE', { align: 'center', fontSize: 20, font: LAYOUT.fonts.bold });

// Right align
this.text('Total: $100', { align: 'right' });

// Left align (default)
this.text('Company Name');
```

### Adding Custom Sections

To add a new section (e.g., "Notes"):

```typescript
// In drawEnglishPage() or drawPolishPage(), after payment terms:

this.moveCursor(LAYOUT.spacing.sectionGap);
this.text('Notes', { fontSize: LAYOUT.fonts.sizes.large, font: LAYOUT.fonts.bold });
this.text('This is a custom note section.');
this.text('You can add any additional information here.');
```

### Modifying the Sidebar Position

The sidebar X position is set in each page method:

```typescript
// Change this line:
const sidebarX = 400;

// To move it further right:
const sidebarX = 420;

// Or further left:
const sidebarX = 380;
```

## How to Apply Changes

1. **Edit the LAYOUT configuration** in `src/generators/improvedPdfGenerator.ts`
2. **Rebuild the project:**
   ```bash
   npm run build
   ```
3. **Generate a test invoice:**
   ```bash
   npm run generate -- generate --salary 100 --bonus 100 --month November --output test.pdf
   ```
4. **Open test.pdf** to see your changes
5. **Iterate** until you're happy with the result

## Comparison: Before vs After

### Before (Old PDFGenerator)

**Problems:**
- Hardcoded coordinates everywhere
- Changing one value breaks everything
- Need to recalculate all positions manually
- Very difficult to maintain

**Example:**
```typescript
doc.text('Invoice', 50, 200)        // What if I want to move this?
   .text('Number', 400, 200)        // Have to change this too
   .text('Date', 50, 220)           // And this
   .rect(50, 260, 495, 25)          // And recalculate table position
```

### After (ImprovedPdfGenerator)

**Benefits:**
- All layout config in one place
- Change colors/fonts/spacing easily
- Automatic position calculations
- Much easier to maintain

**Example:**
```typescript
// Just change the config!
const LAYOUT = {
  colors: { tableHeader: '#4A90E2' },  // Done!
  spacing: { sectionGap: 30 },         // Easy!
  fonts: { sizes: { title: 20 } }      // Simple!
};

// Code uses the config automatically
this.text('Invoice', { fontSize: LAYOUT.fonts.sizes.title });
```

## Tips for Customization

1. **Make small changes** - Test after each change
2. **Use consistent values** - Stick to your theme
3. **Test with different data** - Try 1 item, 5 items, etc.
4. **Keep backups** - Save working versions
5. **Check both pages** - English and Polish

## Common Tasks

| Task | Difficulty | Lines to Change |
|------|-----------|----------------|
| Change colors | ⭐ Very Easy | 6 lines in LAYOUT.colors |
| Adjust font sizes | ⭐ Very Easy | 4 lines in LAYOUT.fonts.sizes |
| Modify spacing | ⭐ Very Easy | 3 lines in LAYOUT.spacing |
| Change margins | ⭐ Very Easy | 4 lines in LAYOUT.page.margin |
| Add logo | ⭐⭐ Easy | ~5 lines in drawEnglishPage/drawPolishPage |
| Adjust table columns | ⭐⭐ Easy | 2 lines in drawTable |
| Add new section | ⭐⭐⭐ Moderate | 10-20 lines |
| Restructure layout | ⭐⭐⭐⭐ Advanced | Many lines |

## Support for Future HTML-to-PDF Migration

The HTML invoice templates we created earlier (`src/templates/invoice-*.html`) are still available! If you want even easier customization in the future, you can:

1. Install a working HTML-to-PDF library (when network/environment permits)
2. Use those templates for PDF generation
3. Get CSS-based customization (even easier than the current system)

The current improved PDFKit generator provides a great balance of:
- ✅ Easy customization (via LAYOUT config)
- ✅ No external dependencies
- ✅ Works in all environments
- ✅ Good performance

## Summary

The improved PDF generator makes customization **much easier** by:

1. **Centralizing layout configuration** - All settings in one place
2. **Using constants instead of magic numbers** - Self-documenting code
3. **Providing helper methods** - Reusable drawing functions
4. **Automatic position tracking** - No manual coordinate calculations

**Result:** You can now customize colors, fonts, spacing, and layout by editing simple configuration values instead of hunting through code and recalculating coordinates!

Happy customizing! 🎨
