# PDF Customization Guide

## Overview

The invoice generator uses a **configuration-based PDF system** that makes styling and layout adjustments much easier than coordinate-based generation.

### Important: Understanding PDF Customization

**What you CAN customize easily (no rebuild required):**
- ✅ Colors (text, table headers, borders)
- ✅ Font sizes
- ✅ Spacing (line height, gaps, margins)
- ✅ Page margins

**What requires coding (rebuild required):**
- ⚠️ Layout structure (moving sections, reordering elements)
- ⚠️ Adding/removing content sections
- ⚠️ Table column widths
- ⚠️ Text content and positioning

**Comparison with Email Templates:**
- **Email templates**: True HTML/CSS templates, no rebuild needed for any styling changes
- **PDF generation**: Configuration-based with external config file for styling, but layout changes require TypeScript editing

## Configuration File Location

**File:** `pdf-config.json` (in project root)

This JSON file contains all styling configuration. You can edit this file directly without touching TypeScript code or rebuilding for color, font size, and spacing changes.

## Easy Customizations (Edit JSON, No Rebuild)

### 1. Change Colors

**Edit:** `pdf-config.json`

```json
{
  "colors": {
    "primary": "#000000",       // Main text color
    "secondary": "#666666",     // Secondary text
    "link": "blue",             // Links
    "tableHeader": "#d3d3d3",   // Table header background
    "tableBorder": "#000000"    // Table borders
  }
}
```

**Example - Change table header to blue:**
```json
{
  "colors": {
    "tableHeader": "#4A90E2"
  }
}
```

**Example - Use your brand colors:**
```json
{
  "colors": {
    "primary": "#2C3E50",       // Dark blue-gray
    "secondary": "#95A5A6",     // Light gray
    "link": "#3498DB",          // Bright blue
    "tableHeader": "#3498DB",   // Match link color
    "tableBorder": "#2C3E50"    // Dark borders
  }
}
```

### 2. Adjust Font Sizes

**Edit:** `pdf-config.json`

```json
{
  "fonts": {
    "sizes": {
      "small": 10,    // Sidebar info
      "normal": 11,   // Body text
      "large": 14,    // Section headings
      "title": 16     // Page title
    }
  }
}
```

**Example - Make text larger:**
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

**Example - Smaller, more compact:**
```json
{
  "fonts": {
    "sizes": {
      "small": 9,
      "normal": 10,
      "large": 12,
      "title": 14
    }
  }
}
```

**Note:** Font family changes are currently hardcoded in TypeScript (Helvetica). Changing font families requires editing `src/generators/improvedPdfGenerator.ts` and rebuilding.

### 3. Modify Spacing

**Edit:** `pdf-config.json`

```json
{
  "spacing": {
    "lineHeight": 15,     // Space between lines
    "sectionGap": 20,     // Space between sections
    "smallGap": 10        // Small gaps
  }
}
```

**Example - More breathing room:**
```json
{
  "spacing": {
    "lineHeight": 18,
    "sectionGap": 30,
    "smallGap": 15
  }
}
```

**Example - Compact layout:**
```json
{
  "spacing": {
    "lineHeight": 12,
    "sectionGap": 15,
    "smallGap": 8
  }
}
```

### 4. Adjust Page Margins

**Edit:** `pdf-config.json`

```json
{
  "page": {
    "margin": {
      "top": 50,
      "bottom": 50,
      "left": 50,
      "right": 50
    }
  }
}
```

**Example - Larger margins:**
```json
{
  "page": {
    "margin": {
      "top": 70,
      "bottom": 70,
      "left": 70,
      "right": 70
    }
  }
}
```

**Example - Asymmetric margins (for binding):**
```json
{
  "page": {
    "margin": {
      "top": 50,
      "bottom": 50,
      "left": 80,
      "right": 50
    }
  }
}
```

## Complete Theme Examples

### Example 1: Modern Blue Theme

Create or edit `pdf-config.json`:

```json
{
  "page": {
    "margin": { "top": 60, "bottom": 60, "left": 60, "right": 60 },
    "width": 595,
    "height": 842
  },
  "colors": {
    "primary": "#2C3E50",
    "secondary": "#7F8C8D",
    "link": "#3498DB",
    "tableHeader": "#3498DB",
    "tableBorder": "#2C3E50"
  },
  "fonts": {
    "regular": "Helvetica",
    "bold": "Helvetica-Bold",
    "sizes": {
      "small": 11,
      "normal": 12,
      "large": 16,
      "title": 20
    }
  },
  "spacing": {
    "lineHeight": 16,
    "sectionGap": 25,
    "smallGap": 12
  }
}
```

### Example 2: Professional Gray Theme

```json
{
  "page": {
    "margin": { "top": 50, "bottom": 50, "left": 50, "right": 50 },
    "width": 595,
    "height": 842
  },
  "colors": {
    "primary": "#333333",
    "secondary": "#666666",
    "link": "#0066CC",
    "tableHeader": "#E8E8E8",
    "tableBorder": "#CCCCCC"
  },
  "fonts": {
    "regular": "Helvetica",
    "bold": "Helvetica-Bold",
    "sizes": {
      "small": 10,
      "normal": 11,
      "large": 13,
      "title": 16
    }
  },
  "spacing": {
    "lineHeight": 15,
    "sectionGap": 20,
    "smallGap": 10
  }
}
```

### Example 3: Compact Theme

```json
{
  "page": {
    "margin": { "top": 40, "bottom": 40, "left": 40, "right": 40 },
    "width": 595,
    "height": 842
  },
  "colors": {
    "primary": "#000000",
    "secondary": "#666666",
    "link": "blue",
    "tableHeader": "#d3d3d3",
    "tableBorder": "#000000"
  },
  "fonts": {
    "regular": "Helvetica",
    "bold": "Helvetica-Bold",
    "sizes": {
      "small": 9,
      "normal": 10,
      "large": 12,
      "title": 14
    }
  },
  "spacing": {
    "lineHeight": 12,
    "sectionGap": 15,
    "smallGap": 8
  }
}
```

## Advanced Customizations (Require Coding)

The following changes require editing TypeScript files and rebuilding:

### 1. Change Table Column Widths

**File:** `src/generators/improvedPdfGenerator.ts`
**Method:** `drawTable()`
**Lines:** ~163-165

```typescript
const col1Width = tableWidth * 0.7;  // 70% for description
const col2Width = tableWidth * 0.3;  // 30% for amount
```

Change to give more space to amounts:
```typescript
const col1Width = tableWidth * 0.65;  // 65%
const col2Width = tableWidth * 0.35;  // 35%
```

**After editing:** Run `npm run build`

### 2. Change Table Row Height

**File:** `src/generators/improvedPdfGenerator.ts`
**Method:** `drawTable()`
**Line:** ~166

```typescript
const rowHeight = 25;
```

Change to make rows taller:
```typescript
const rowHeight = 30;
```

**After editing:** Run `npm run build`

### 3. Add Logo or Custom Graphics

Requires editing the `drawEnglishPage()` and `drawPolishPage()` methods in `src/generators/improvedPdfGenerator.ts`.

Example:
```typescript
// Add after line 200 in drawEnglishPage()
this.doc.image('path/to/logo.png', LAYOUT.page.margin.left, this.currentY, { width: 100 });
this.moveCursor(60); // Space for logo
```

**After editing:** Run `npm run build`

### 4. Change Layout Structure

Any changes to the order of sections, adding new sections, or modifying the overall structure requires editing:
- `drawEnglishPage()` method (~179-236)
- `drawPolishPage()` method (~238-295)

**After editing:** Run `npm run build`

## Customization Workflow

### For Styling Changes (Colors, Fonts, Spacing, Margins)

1. Edit `pdf-config.json`
2. Save the file
3. Run invoice generation
4. ✅ No rebuild needed!

### For Layout/Structure Changes

1. Edit `src/generators/improvedPdfGenerator.ts`
2. Run `npm run build`
3. Test the changes

## Before vs After: The Improvement

### Old Approach (Coordinates)
```typescript
// Had to edit coordinates everywhere
doc.text('Invoice', 50, 200)
   .text('Description', 50, 230)
   .rect(50, 260, 495, 25)
   .fillAndStroke('#d3d3d3', '#000000')  // Color hardcoded here
   .text('Item 1', 55, 268)
   .rect(50, 285, 495, 25)
   .fillAndStroke('#d3d3d3', '#000000')  // And here
   .text('Item 2', 55, 293)
// Changing color = find and replace in 10+ places
```

**Problems:**
- Coordinates everywhere
- Colors duplicated
- Hard to maintain
- Easy to break

### New Approach (Configuration-Based)
```json
// Edit once in config file
{
  "colors": {
    "tableHeader": "#4A90E2"
  }
}
```

```typescript
// Code uses configuration
this.doc
  .rect(x, y, width, height)
  .fillAndStroke(LAYOUT.colors.tableHeader, LAYOUT.colors.tableBorder)
```

**Benefits:**
- ✅ Change in one place
- ✅ Self-documenting
- ✅ No rebuild for styling
- ✅ Easy to maintain

## Limitations

### What This Is NOT

❌ **Not a template system** - Unlike email templates, you cannot edit HTML/CSS to change PDF layout
❌ **Not designer-friendly** - Layout changes require TypeScript knowledge
❌ **Not hot-reload** - Code changes require rebuild

### What This IS

✅ **Configuration-based styling** - Colors, fonts, spacing in external JSON file
✅ **Better than coordinates** - 80-94% less code to change for styling
✅ **Maintainable** - Centralized configuration, helper methods
✅ **No rebuild for styling** - Edit JSON for colors/fonts/spacing

## Comparison: Email vs PDF Customization

| Feature | Email Templates | PDF Generation |
|---------|----------------|----------------|
| Edit format | HTML/CSS | JSON config + TypeScript |
| Styling changes | Edit HTML/CSS | Edit JSON |
| Layout changes | Edit HTML | Edit TypeScript |
| Rebuild for styling | ❌ No | ❌ No (JSON) |
| Rebuild for layout | ❌ No | ✅ Yes |
| Preview | Browser | Generate PDF |
| Skills required | HTML/CSS | JSON (basic), TypeScript (advanced) |
| Designer-friendly | ✅ Yes | ⚠️ For colors only |

## Tips

1. **Test incrementally** - Make one change at a time and test
2. **Keep backups** - Save original `pdf-config.json` before major changes
3. **Use JSON validator** - Ensure JSON is valid (trailing commas not allowed in JSON)
4. **Check colors** - Use hex codes (#RRGGBB) or named colors ('blue', 'red', etc.)
5. **Stay consistent** - Use same units for all spacing values

## Troubleshooting

### PDF looks broken after config change
- Check JSON syntax (no trailing commas, proper quotes)
- Verify all values are reasonable (positive numbers for sizes)
- Restore from backup config

### Config changes not appearing
- Make sure you're editing `pdf-config.json` in the project root
- Check console for warnings about config file not found
- Verify the file is properly formatted JSON

### Text overlapping or cut off
- Increase `lineHeight` or `sectionGap` values
- Check page margins aren't too large
- Verify font sizes aren't too big for available space

## Summary

### Easy Customization (No Rebuild)
Edit `pdf-config.json` for:
- Colors (text, backgrounds, borders)
- Font sizes
- Spacing and gaps
- Page margins

### Advanced Customization (Rebuild Required)
Edit `src/generators/improvedPdfGenerator.ts` for:
- Table column widths
- Row heights
- Layout structure
- Adding images/graphics
- Content sections

### Honest Assessment
- **Much better** than coordinate-based generation (80-94% less code to change)
- **Easier** to maintain with centralized configuration
- **Not template-based** - Still requires some coding for layout changes
- **Good enough** for most styling customizations via JSON config

For true template-based customization (HTML/CSS), use the email template system. For PDFs, this configuration-based approach provides a good balance between flexibility and ease of use.
