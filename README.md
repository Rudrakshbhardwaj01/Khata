# Khata (खाता)

Khata is an open-source, browser-based invoice creation application. It allows individuals, freelancers, and businesses to create professional invoices entirely in the browser without requiring a server, account, or backend.

Create an invoice, configure taxes and branding, preview the result, and download a professional PDF - all locally in your browser. No signup required. No data leaves your device.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture and Data Flow](#architecture-and-data-flow)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation and Local Development](#installation-and-local-development)
- [Available Scripts](#available-scripts)
- [How to Use Khata](#how-to-use-khata)
- [Invoice Model and Calculations](#invoice-model-and-calculations)
- [Currency and GST Behavior](#currency-and-gst-behavior)
- [Live Preview and PDF Export](#live-preview-and-pdf-export)
- [Privacy and Data Handling](#privacy-and-data-handling)
- [Customization and Templates](#customization-and-templates)
- [Accessibility and Responsive Behavior](#accessibility-and-responsive-behavior)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Known Limitations](#known-limitations)
- [License](#license)
- [Project Links](#project-links)

---

## Features

- **Invoice creation and editing** - Create invoices from scratch with a clear, intuitive editing workflow.
- **Invoice metadata** - Invoice number, date, due date, type (B2B, B2C, Export, SEZ), place of supply, PO/reference numbers.
- **Seller and customer management** - Complete contact details including GSTIN, address, email, phone, and bank details for the seller.
- **Line-item management** - Add, edit, remove, and reorder line items with description, HSN/SAC code, quantity, unit, unit price, discount (percentage and flat amount), tax category, and tax rate.
- **Tax configuration** - India-specific GST support with intra-state (CGST + SGST) and inter-state (IGST) tax treatment, HSN/SAC codes, GSTIN fields, and place-of-supply selection.
- **Currency support** - INR, USD, EUR, GBP, AED, SGD, AUD, CAD with locale-aware formatting.
- **Discount handling** - Percentage and flat-amount discounts per line item.
- **Tax categories** - GST, IGST, CGST+SGST, Exempt, Nil Rated, Non-GST with configurable rates (0%, 0.25%, 3%, 5%, 12%, 18%, 28%).
- **Three professional templates** - Modern, Classic, and Creative layouts.
- **Customization** - Accent color selection (6 presets + custom), font family (4 options), logo upload (PNG/JPG/WebP, max 2MB), logo position, and template selection.
- **Live preview** - Real-time invoice preview that updates as you type, with dynamic scaling to fit the viewport.
- **PDF export** - Client-side A4 PDF generation using jsPDF + jspdf-autotable with Gajraj One font for the Devanagari wordmark.
- **Invoice validation** - Field-level validation with inline error messages for required fields, GSTIN format, dates, numeric ranges, and email/phone formats.
- **Multi-currency support** - 8 currencies (INR, USD, EUR, GBP, AED, SGD, AUD, CAD) with locale-aware formatting.
- **Responsive design** - Works on desktop, tablet, and mobile viewports.
- **Keyboard accessible** - Semantic HTML, focus states, ARIA attributes, and keyboard navigation throughout.
- **Privacy-first** - No backend, no database, no authentication, no analytics, no external requests for core functionality. All processing happens in the browser.

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend Framework | React | 19.3.1 |
| Language | TypeScript | 7.0.2 |
| Build Tool | Vite | 8.3.5 |
| State Management | Zustand | 5.0.16 |
| Routing | React Router DOM | 7.18.5 |
| Styling | Plain CSS with CSS Variables | - |
| PDF Generation | jsPDF + jspdf-autotable | 4.2.1 / 5.0.9 |
| Linting | Oxlint | 1.89.0 |
| Testing | Node built-in test runner | - |
| CSS Minification | esbuild | 0.28.2 |

**Architectural choices:**

- **React 19** with modern hooks and concurrent features.
- **Zustand** for lightweight, subscription-based state management with `subscribeWithSelector` middleware.
- **Vite** with React plugin for fast HMR and optimized production builds using esbuild for CSS minification.
- **Plain CSS with CSS custom properties** for theming, avoiding CSS-in-JS runtime overhead.
- **jsPDF + jspdf-autotable** for client-side PDF generation with automatic table layout and multi-page support.
- **Node.js built-in test runner** (`node --experimental-strip-types --test`) for zero-config testing with TypeScript files.
- **Oxlint** for fast, zero-config linting with React and TypeScript rules.
- **Strict TypeScript** with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `noEmit` for build-time type checking.

---

## Architecture and Data Flow

Khata follows a unidirectional data flow with a clear separation between state, calculations, rendering, and export.

```
User Input → Invoice State (Zustand) → Validation & Calculations (Pure Functions)
    → Live Preview (React Templates) → PDF Export (jsPDF)
```

### Layers

1. **State Layer** (`src/store/invoiceStore.ts`) - Zustand store holding the complete invoice object. All mutations go through immutable actions that trigger recalculation via the calculation engine.

2. **Domain Layer** (`src/domain/`) - Pure TypeScript functions with no React dependencies:
   - `calculations/engine.ts` - Line-item calculations, tax breakdowns (CGST/SGST/IGST), totals, rounding, supply-type determination.
   - `validation/validator.ts` - Field-level and cross-field validation with error/warning severity.

3. **Types** (`src/types/invoice.ts`) - Central type definitions for Invoice, LineItem, Party, Address, Currency, TaxCategory, Customization, etc.

4. **Services** (`src/services/pdf.ts`) - Client-side PDF generation using jsPDF + jspdf-autotable with Gajraj One font embedding for the Devanagari wordmark.

4. **Templates** (`src/components/templates/templateRenderers.tsx`) - React components rendering the invoice document for live preview (shared logic with PDF layout).

5. **Editor Components** (`src/components/editor/`) - Form components for each editor section (Invoice Details, Seller, Customer, Items, Tax, Customization, Preview).

6. **Routing** - React Router with two routes: `/` (landing page) and `/editor` (invoice editor).

### Data Flow Details

1. User edits a field → Zustand action updates invoice state.
2. Store action calls `recalculateInvoice(items, seller, customer, metadata)` → returns recalculated line items and totals.
3. React components re-render with updated invoice state.
4. Preview pane re-renders using the selected template renderer.
5. On "Download PDF" → `generatePDF(invoice)` creates jsPDF instance, embeds Gajraj One font, renders document, triggers browser download.

**Key invariant:** The calculation engine is the single source of truth for all financial values. The preview, editor totals, and PDF export all consume the same calculated results from the engine.

---

## Repository Structure

```
Khata/
├── public/
│   ├── background.mp4           # Landing page animated background
│   ├── favicon.svg              # App favicon
│   ├── GajrajOne-Regular.ttf    # Devanagari font for wordmark
│   ├── apple-touch-icon.png     # iOS home screen icon
│   ├── favicon.ico              # Legacy favicon
│   ├── site.webmanifest         # PWA manifest
│   └── icons.svg                # Inline SVG icons
├── src/
│   ├── components/
│   │   ├── editor/              # Invoice editor components
│   │   │   ├── EditorLayout.tsx        # Main editor layout (3-col: sidebar | content | preview)
│   │   │   ├── EditorSidebar.tsx       # Left navigation sidebar
│   │   │   ├── EditorHeader.tsx        # Top header with actions
│   │   │   ├── InvoiceDetailsForm.tsx  # Invoice metadata form
│   │   │   ├── SellerForm.tsx          # Seller details form
│   │   │   ├── CustomerForm.tsx        # Customer details form
│   │   │   ├── LineItemsEditor.tsx     # Line items table editor
│   │   │   ├── TaxSettingsForm.tsx     # GST configuration
│   │   │   ├── CustomizationForm.tsx   # Branding & template settings
│   │   │   └── *.css                    # Scoped CSS per component
│   │   ├── preview/
│   │   │   ├── PreviewPane.tsx         # Live preview panel
│   │   │   └── PreviewPane.css
│   │   ├── templates/
│   │   │   └── templateRenderers.tsx   # 3 invoice templates (Modern, Classic, Creative)
│   │   ├── icons.tsx                   # Inline SVG icons
│   │   └── *.tsx                       # Landing page sections
│   ├── domain/
│   │   ├── calculations/engine.ts      # Pure calculation engine
│   │   └── validation/validator.ts     # Validation logic
│   ├── services/
│   │   └── pdf.ts                      # PDF generation with jsPDF
│   ├── store/
│   │   └── invoiceStore.ts             # Zustand store + actions
│   ├── types/
│   │   └── invoice.ts                  # Core type definitions
│   ├── components/                     # Landing page sections
│   ├── App.tsx                         # Routing + layout
│   ├── main.tsx                        # Entry point
│   └── *.css                           # Global styles + design tokens
├── tests/
│   ├── engine.test.ts                  # Calculation engine unit tests
│   └── e2e.test.ts                     # End-to-end tests (skeleton)
├── index.html
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── .oxlintrc.json
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18 (tested with Node 20+)
- **npm** ≥ 9 (comes with Node.js) or compatible package manager (pnpm, yarn)
- No database, backend, Docker, or external services required

The project runs entirely in the browser. No environment variables or configuration files are needed for local development.

---

## Installation and Local Development

```bash
# Clone the repository
git clone https://github.com/Rudrakshbhardwaj01/Khata.git
cd Khata

# Install dependencies (uses npm ci for reproducible installs)
npm ci

# Start development server with HMR
npm run dev
```

The development server starts at `http://localhost:5173` (or the next available port). Open this URL in your browser.

The Vite dev server provides HMR for instant feedback during development. The landing page loads at `/`, the editor at `/editor`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build (`vite build`) |
| `npm run lint` | Run Oxlint on source files |
| `npm test` | Run unit tests with Node's built-in test runner |
| `npm run preview` | Preview the production build locally |

**Recommended pre-commit workflow:**
```bash
npm run lint && npm run build && npm test
```

---

## How to Use Khata

### 1. Open the Editor
Navigate to `http://localhost:5173/editor` (or click "Open Editor" on the landing page).

### 2. Create a New Invoice
The editor opens with a blank invoice. The invoice number and dates are pre-filled. Click **+ New** in the header to reset to a blank invoice (with confirmation if you have unsaved changes).

### 3. Enter Invoice Details
**Invoice Details** tab:
- Invoice Number (auto-generated, editable)
- Invoice Date and Due Date
- Currency (INR, USD, EUR, GBP, AED, SGD, AUD, CAD)
- Invoice Type (B2B, B2C, Export, SEZ)
- Place of Supply (state code for GST)
- PO Reference, Reference Number (optional)
- Notes, Payment Terms
- Reverse Charge Mechanism checkbox

### 4. Enter Seller Details
**Seller** tab:
- Business name, GSTIN, email, phone, website
- Address (line 1, line 2, city, state, state code, PIN, country)
- Bank details (account name, number, IFSC, bank name, branch, account type)
- Logo upload (PNG/JPG/WebP, max 2MB)

### 5. Enter Customer Details
**Customer** tab:
- Customer name, GSTIN, email, phone
- Billing address
- Optional separate shipping address

### 6. Add Line Items
**Items** tab:
- Click **+ Add Item** to add rows
- For each item: Description, HSN/SAC code (dropdown with common codes), Quantity, Unit, Unit Price, Discount %, Tax Rate, Tax Category (GST/IGST/CGST+SGST/Exempt/Nil Rated/Non-GST)
- Drag handle for reordering (future enhancement)
- Live totals update as you type

### 6. Configure Tax
**Tax** tab:
- View detected supply type (Intra/Inter-state) based on seller state vs place of supply
- Set Invoice Type, Place of Supply, Reverse Charge
- View tax breakdown (CGST, SGST, IGST) in real time

### 7. Customize Appearance
**Customization** tab:
- Template: Modern / Classic / Creative
- Accent color: 6 presets + custom color picker
- Font family: Inter, System UI, Georgia, JetBrains Mono
- Logo upload/remove, position (left/center/right)
- Live mini-preview updates instantly

### 8. Review Live Preview
The right panel shows a live, scaled preview of the invoice (A4 proportions). It updates in real time as you edit.

### 9. Download PDF
Click **Download PDF** in the header. The browser downloads an A4 PDF with:
- All invoice data, line items, tax breakdown
- Selected template styling, colors, fonts, logo
- Professional formatting with page numbers for multi-page invoices

### 10. Start Fresh
Click **+ New** to reset the editor. Unsaved changes prompt for confirmation.

---

## Invoice Model and Calculations

### Line Item Calculation

For each line item:
```
baseAmount = quantity × unitPrice
discountFromPercent = baseAmount × (discountPercent / 100)
totalDiscount = discountFromPercent + discountAmount
taxableAmount = max(0, baseAmount - totalDiscount)

taxAmount = taxableAmount × (taxRate / 100)  [if taxable category]
lineAmount = taxableAmount  (per reference design)
```

**Rounding:** All monetary values use `roundToTwoDecimals(value)` → `Math.round((value + Number.EPSILON) * 100) / 100` to avoid floating-point drift.

### Tax Calculation

**Supply type** determined by seller state code vs. place of supply:
- Same state → **IntraState** → CGST + SGST (split evenly)
- Different states → **InterState** → IGST
- Export invoice type → Zero tax (export treatment)

**Tax categories:**
- `GST` / `CGST_SGST` → Standard intra-state split
- `IGST` → Inter-state
- `Exempt` / `NilRated` / `NonGST` → No tax calculated

### Totals Calculation

```
subtotal = Σ(quantity × unitPrice)
totalDiscount = Σ(discountFromPercent + discountAmount)
taxableValue = Σ(taxableAmount)
totalTax = cgst + sgst + igst
grandTotal = taxableValue + totalTax
balanceDue = grandTotal - amountPaid
```

**Rounding policy:** Individual line amounts rounded to 2 decimals. Totals rounded after summation. No automatic round-off adjustment for INR (configurable if needed).

### Validation

Field-level validation with severity (`error` | `warning`):
- Required fields: name, address line 1, city, state, state code (India), pincode (6 digits India), country, invoice number, invoice date, due date ≥ invoice date
- GSTIN format validation (regex + state code 1–38)
- Email/phone format validation
- Numeric ranges: quantity ≥ 0, unit price ≥ 0, discount 0–100%, tax rate ≥ 0
- At least one line item required for valid invoice

---

## Currency and GST Behavior

### Currency Support

| Currency | Code | Symbol | Locale |
|----------|------|--------|--------|
| Indian Rupee | INR | ₹ | en-IN |
| US Dollar | USD | $ | en-US |
| Euro | EUR | € | de-DE |
| British Pound | GBP | £ | en-GB |
| UAE Dirham | AED | د.إ | ar-AE |
| Singapore Dollar | SGD | S$ | en-SG |
| Australian Dollar | AUD | A$ | en-AU |
| Canadian Dollar | CAD | C$ | en-CA |

**Currency behavior:**
- Selection changes display formatting and PDF currency symbol/label
- **No currency conversion** - amounts are stored as entered; changing currency only changes formatting
- PDF export uses `Intl.NumberFormat` with the selected currency's locale

### GST Implementation

| Invoice Type | Supply Type | CGST | SGST | IGST |
|--------------|-------------|------|------|------|
| B2B / B2C | Intra-state (same state) | 50% | 50% | 0 |
| B2B / B2C | Inter-state (different states) | 0 | 0 | 100% |
| Export | - | 0 | 0 | 0 (zero-rated) |
| SEZ | - | 0 | 0 | 0 (zero-rated) |

**Place of Supply** drives intra/inter-state determination using GST state codes. The seller's state code (from address) is compared against the invoice's place of supply.

**Tax categories per line item:**
- `GST` / `CGST_SGST` - Standard intra-state
- `IGST` - Inter-state
- `Exempt` / `NilRated` / `NonGST` - No tax

**Compliance note:** Khata provides calculation tooling based on standard GST rules. It does not file returns, validate against government portals, or guarantee statutory compliance. Users must verify invoices meet their specific legal obligations.

---

## Live Preview and PDF Export

### Live Preview

- Renders the selected template (Modern/Classic/Creative) in a right-side panel
- Scales dynamically to fit panel width (A4 proportions preserved)
- Updates in real time as you edit any field
- Uses the same template renderers as PDF export for consistency
- Gray background (`#f1f3f5`) with white A4 page, subtle shadow

### PDF Export

**Implementation:** `src/services/pdf.ts` using jsPDF + jspdf-autotable.

**Features:**
- A4 portrait, 18mm margins
- Gajraj One font embedded for Devanagari wordmark (खाता)
- Business logo embedding (data URL)
- Multi-page support with automatic page breaks
- Page numbers on multi-page documents
- Repeating table headers on page breaks
- Professional A4 layout matching reference design

**Fonts:**
- Gajraj One (Devanagari) for wordmark - embedded via base64 VFS
- Helvetica for all other text (built-in)

**Limitations:**
- No font subsetting - full font embedded
- Complex Unicode beyond Devanagari/Latin may not render
- Table rows do not split across pages (autoTable limitation)
- No digital signature support

**File naming:** `Invoice-<invoice-number>.pdf` (sanitized filename)

---

## Privacy and Data Handling

Khata is designed with privacy as a core principle:

| Aspect | Behavior |
|--------|----------|
| **Network requests** | None for core functionality. Only initial asset loads (JS, CSS, font, video). |
| **External APIs** | None for core functionality. Google Fonts (Inter) loaded via preconnect. |
| **Analytics** | None. No tracking, telemetry, or user identification. |
| **Storage** | No `localStorage`, `sessionStorage`, or IndexedDB. Invoice state exists only in memory. |
| **Persistence** | None. Refreshing or closing the tab discards all unsaved work. |
| **File uploads** | Logo images converted to data URLs in memory. Never uploaded. |
| **PDF generation** | Entirely client-side via jsPDF. No server upload. |
| **Downloads** | Standard browser download via `blob: URL` or `doc.save()`. |

**User responsibility:** Export important invoices as PDF before refreshing or closing the tab. There is no autosave, cloud backup, or recovery mechanism.

**External resources:** The landing page loads Google Fonts (Inter) and a background video from `/public/background.mp4`. The editor loads the Gajraj One font from `/public/GajrajOne-Regular.ttf` for PDF embedding. No invoice data is transmitted with these requests.

---

## Customization and Templates

### Templates

| Template | Characteristics |
|----------|----------------|
| **Modern** | Clean header with colored bar, minimal borders, blue accent |
| **Classic** | Traditional top-border header, full tax column breakdown, Georgia font |
| **Creative** | Colored header background, simplified table, accent color throughout |

All templates render the same data; only visual presentation differs.

### Customization Options

| Option | Values |
|--------|--------|
| Template | Modern / Classic / Creative |
| Accent Color | 6 presets + custom color picker |
| Font Family | Inter, System UI, Georgia, JetBrains Mono |
| Logo | Upload PNG/JPG/WebP (≤2MB, 300×100px recommended) |
| Logo Position | Left / Center / Right |

Customization persists in the invoice state and applies to both live preview and PDF export.

---

## Accessibility and Responsive Behavior

### Accessibility
- Semantic HTML5 elements (`header`, `main`, `aside`, `nav`, `section`, `footer`)
- ARIA labels, `aria-expanded`, `aria-controls`, `aria-labelledby` on accordions and toggles
- Focus-visible outlines on all interactive elements
- Keyboard navigation: Tab through all controls, Enter/Space to activate
- Sufficient color contrast (WCAG AA target)
- Reduced motion respected (`prefers-reduced-motion`)

### Responsive Breakpoints
| Viewport | Behavior |
|----------|----------|
| ≥1200px | Three-column: sidebar (280px) \| editor (flex) \| preview (420px) |
| 1024–1199px | Sidebar collapsible, preview below editor |
| 768–1023px | Stacked: header → sidebar (full width) → editor → preview |
| <768px | Mobile-optimized: stacked, touch-friendly inputs, collapsible sidebar |

**Note:** The preview panel scales proportionally; on narrow screens it may require horizontal scroll within the panel rather than shrinking the invoice content.

---

## Testing and Quality Assurance

### Test Suite
| Test File | Coverage |
|-----------|----------|
| `tests/engine.test.ts` | 18 calculation engine tests (line items, taxes, totals, rounding, currencies, edge cases) |
| `tests/e2e.test.ts` | E2E test skeleton (expand as needed) |

**Run tests:**
```bash
npm test
```

### Linting
```bash
npm run lint
```
Uses Oxlint with React/TypeScript rules. No Prettier - code style enforced by TypeScript strictness and Oxlint.

### Type Checking
```bash
npm run build  # includes `tsc -b`
```
Strict TypeScript config: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `exactOptionalPropertyTypes` (via `exactOptionalPropertyTypes: true` in base config).

### Build Verification
```bash
npm run build
```
Produces optimized production bundle in `dist/` with esbuild CSS minification.

---

## Deployment

Khata is a static single-page application. Any static hosting works.

### Build Output
```bash
npm run build
# Output: dist/ (index.html, assets/*.js, assets/*.css, public assets)
```

### Static Hosting Options
| Platform | Notes |
|----------|-------|
| Vercel | `vercel deploy dist --prod` |
| Netlify | Connect repo, build command `npm run build`, publish `dist` |
| GitHub Pages | Deploy `dist` to `gh-pages` branch |
| Cloudflare Pages | Connect repo, build command `npm run build`, output `dist` |
| Any static host | Upload `dist/` contents |

**No server-side rendering, API routes, or environment variables required.**

---

## Contributing

Contributions are welcome. Please follow this workflow:

1. **Fork** the repository: `https://github.com/Rudrakshbhardwaj01/Khata`
2. **Clone** your fork: `git clone https://github.com/<your-username>/Khata.git`
3. **Install:** `npm ci`
4. **Branch:** `git checkout -b feat/your-feature-name`
5. **Develop:** Make focused changes. Run `npm run dev` to test.
6. **Validate:** `npm run lint && npm run build && npm test`
7. **Commit:** `git commit -m "feat: descriptive message"`
8. **Push:** `git push origin feat/your-feature-name`
9. **PR:** Open a Pull Request against `main` with a clear description.

**Code style:** Follow existing patterns. TypeScript strict mode and Oxlint enforce consistency. No Prettier config - formatting is implicit via compiler and linter.

**PR checklist:**
- [ ] TypeScript compiles (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Manual testing of affected flows
- [ ] No unrelated changes

---

## Known Limitations

| Area | Limitation |
|------|------------|
| **Persistence** | No localStorage/IndexedDB. Refresh loses unsaved work. |
| **PDF Fonts** | Only Gajraj One (Devanagari) and Helvetica embedded. Other scripts may not render. |
| **PDF Table Pagination** | Rows don't split across pages; long rows may push to next page. |
| **PDF Fonts** | No font subsetting; full font embedded (larger PDF size). |
| **Multi-currency** | Display formatting only. No conversion or historical rates. |
| **GST Compliance** | Calculations follow standard rules but no govt. portal integration or filing. |
| **Mobile Editing** | Line-items table horizontal scrolls on narrow screens; not fully touch-optimized. |
| **Drag Reorder** | Drag handles present but reorder not yet implemented in store. |
| **Invoice Duplication** | No "Duplicate Invoice" feature. |
| **Payment Tracking** | `amountPaid` / `balanceDue` fields exist but no payment entry UI. |
| **Multi-language** | English only. Hindi wordmark only. |

---

## License

Khata is released under the **MIT License**.

See [LICENSE](LICENSE) for the full text.

```
MIT License

Copyright (c) 2025 Rudraksh Bharadwaj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Project Links

- **GitHub Repository:** https://github.com/Rudrakshbhardwaj01/Khata
- **Portfolio:** https://rudrakshbhardwaj.vercel.app/

For issues, feature requests, or contributions, use the GitHub repository.
The creator is Rudraksh Bharadwaj.

---

*Khata (खाता) - Professional invoicing for everyone. Open source, privacy-first, no account required.*