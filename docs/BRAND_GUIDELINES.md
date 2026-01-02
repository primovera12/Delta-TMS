# Brand & Visual Guidelines - Wheelchair Transportation Platform

> **Design Inspiration:** Stripe
> **Style:** Clean, spacious, trustworthy, professional
> **Last Updated:** January 2026

---

## Design Philosophy

### Why Stripe's Style Works for Medical Transport

1. **Trust** — Patients trust you with their safety; clean design reinforces reliability
2. **Clarity** — Complex info (pricing, schedules) presented simply
3. **Accessibility** — Stripe's spacious design naturally accommodates larger text
4. **Professionalism** — Facilities and hospitals expect polished B2B software

### Core Principles

| Principle | How We Apply It |
|-----------|-----------------|
| **Generous whitespace** | Let content breathe, don't cram |
| **Subtle depth** | Soft shadows, not harsh borders |
| **Clear hierarchy** | Size and weight guide the eye |
| **Purposeful color** | Color highlights, doesn't overwhelm |
| **Refined details** | Smooth corners, consistent spacing |

---

## Color Palette

### Primary Colors

```css
/* Primary Brand - Deep Blue (like Stripe's purple, but medical-trustworthy) */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;   /* Main brand color */
--primary-600: #2563eb;   /* Hover states */
--primary-700: #1d4ed8;   /* Active states */
--primary-800: #1e40af;
--primary-900: #1e3a8a;
```

### Neutral Colors (Stripe-style grays)

```css
/* Grays - Slightly warm, not harsh */
--gray-25: #fcfcfd;       /* Subtle backgrounds */
--gray-50: #f9fafb;       /* Page background */
--gray-100: #f3f4f6;      /* Card hover, borders */
--gray-200: #e5e7eb;      /* Borders, dividers */
--gray-300: #d1d5db;      /* Disabled states */
--gray-400: #9ca3af;      /* Placeholder text */
--gray-500: #6b7280;      /* Secondary text */
--gray-600: #4b5563;      /* Body text */
--gray-700: #374151;      /* Headings */
--gray-800: #1f2937;      /* Primary text */
--gray-900: #111827;      /* High emphasis */
```

### Semantic Colors

```css
/* Success - Soft green */
--success-50: #ecfdf5;
--success-100: #d1fae5;
--success-500: #10b981;   /* Main */
--success-600: #059669;   /* Hover */
--success-700: #047857;   /* Text on light */

/* Warning - Soft amber */
--warning-50: #fffbeb;
--warning-100: #fef3c7;
--warning-500: #f59e0b;   /* Main */
--warning-600: #d97706;   /* Hover */
--warning-700: #b45309;   /* Text on light */

/* Error - Soft red */
--error-50: #fef2f2;
--error-100: #fee2e2;
--error-500: #ef4444;     /* Main */
--error-600: #dc2626;     /* Hover */
--error-700: #b91c1c;     /* Text on light */

/* Info - Soft blue */
--info-50: #eff6ff;
--info-100: #dbeafe;
--info-500: #3b82f6;      /* Main */
--info-600: #2563eb;      /* Hover */
--info-700: #1d4ed8;      /* Text on light */
```

### Background Colors

```css
/* Page backgrounds */
--bg-page: #f9fafb;           /* Main page background (Stripe uses this) */
--bg-surface: #ffffff;         /* Cards, modals */
--bg-elevated: #ffffff;        /* Dropdowns, popovers */
--bg-subtle: #f3f4f6;          /* Subtle sections */

/* Interactive backgrounds */
--bg-hover: #f9fafb;           /* Row/card hover */
--bg-active: #f3f4f6;          /* Active/selected */
--bg-disabled: #f9fafb;        /* Disabled elements */
```

### Color Usage Rules

| Element | Color |
|---------|-------|
| Page background | `--bg-page` (#f9fafb) |
| Cards | `--bg-surface` (#ffffff) |
| Primary text | `--gray-800` (#1f2937) |
| Secondary text | `--gray-500` (#6b7280) |
| Borders | `--gray-200` (#e5e7eb) |
| Primary buttons | `--primary-600` (#2563eb) |
| Links | `--primary-600` (#2563eb) |
| Destructive actions | `--error-600` (#dc2626) |

---

## Typography

### Font Stack

```css
/* Primary font - Inter (same as Stripe) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace - for IDs, codes */
--font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
```

**Install Inter:**
```bash
npm install @fontsource/inter
```

```tsx
// app/layout.tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

### Type Scale

| Name | Size | Weight | Line Height | Use |
|------|------|--------|-------------|-----|
| `display` | 36px | 700 | 1.2 | Hero headings |
| `h1` | 30px | 600 | 1.2 | Page titles |
| `h2` | 24px | 600 | 1.3 | Section headers |
| `h3` | 20px | 600 | 1.4 | Card titles |
| `h4` | 16px | 600 | 1.4 | Subsections |
| `body-lg` | 16px | 400 | 1.6 | Large body text |
| `body` | 14px | 400 | 1.5 | Default body |
| `body-sm` | 13px | 400 | 1.5 | Secondary text |
| `caption` | 12px | 500 | 1.4 | Labels, timestamps |
| `overline` | 11px | 600 | 1.4 | Uppercase labels |

### Typography CSS

```css
/* Headings */
.text-display {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--gray-900);
}

.text-h1 {
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--gray-900);
}

.text-h2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--gray-900);
}

.text-h3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--gray-800);
}

/* Body */
.text-body {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--gray-600);
}

.text-body-lg {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--gray-600);
}

/* Caption */
.text-caption {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--gray-500);
}

/* Overline - small uppercase labels */
.text-overline {
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gray-500);
}
```

---

## Spacing System

### Spacing Scale (Stripe uses 4px base)

```css
--space-0: 0;
--space-1: 4px;      /* Tight */
--space-2: 8px;      /* Compact */
--space-3: 12px;     /* Default gap */
--space-4: 16px;     /* Standard */
--space-5: 20px;     /* Comfortable */
--space-6: 24px;     /* Spacious */
--space-8: 32px;     /* Section gap */
--space-10: 40px;    /* Large section */
--space-12: 48px;    /* Page sections */
--space-16: 64px;    /* Major sections */
--space-20: 80px;    /* Hero spacing */
```

### Spacing Usage

| Context | Spacing |
|---------|---------|
| Inside buttons | 12px horizontal, 8px vertical |
| Inside cards | 24px all sides |
| Between form fields | 16px |
| Between sections | 32px - 48px |
| Page padding | 24px (mobile), 48px (desktop) |
| Between cards in grid | 16px - 24px |

---

## Border Radius

### Radius Scale (Stripe style - smooth, not too round)

```css
--radius-none: 0;
--radius-sm: 4px;      /* Small elements, tags */
--radius-md: 6px;      /* Buttons, inputs (DEFAULT) */
--radius-lg: 8px;      /* Cards, modals */
--radius-xl: 12px;     /* Large cards, panels */
--radius-2xl: 16px;    /* Feature cards */
--radius-full: 9999px; /* Pills, avatars */
```

### Radius Usage

| Element | Radius |
|---------|--------|
| Buttons | 6px |
| Inputs | 6px |
| Cards | 8px |
| Modals | 12px |
| Badges/Tags | 4px |
| Avatars | full (circle) |
| Tooltips | 6px |

---

## Shadows (Stripe's Signature)

Stripe uses very subtle, layered shadows. Not harsh drop shadows.

```css
/* Subtle elevation system */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);

--shadow-sm: 
  0 1px 3px 0 rgb(0 0 0 / 0.1),
  0 1px 2px -1px rgb(0 0 0 / 0.1);

--shadow-md: 
  0 4px 6px -1px rgb(0 0 0 / 0.1),
  0 2px 4px -2px rgb(0 0 0 / 0.1);

--shadow-lg: 
  0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1);

--shadow-xl: 
  0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Stripe-style card shadow (subtle border + shadow) */
--shadow-card: 
  0 0 0 1px rgb(0 0 0 / 0.05),
  0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Elevated card (hover state) */
--shadow-card-hover: 
  0 0 0 1px rgb(0 0 0 / 0.05),
  0 4px 12px 0 rgb(0 0 0 / 0.1);

/* Focus ring */
--shadow-focus: 
  0 0 0 2px #ffffff,
  0 0 0 4px var(--primary-500);
```

### Shadow Usage

| Element | Shadow |
|---------|--------|
| Cards (default) | `--shadow-card` |
| Cards (hover) | `--shadow-card-hover` |
| Dropdowns | `--shadow-lg` |
| Modals | `--shadow-xl` |
| Buttons | none (use background change) |
| Inputs | none (use border) |
| Focus state | `--shadow-focus` |

---

## Borders

### Border Colors

```css
--border-default: #e5e7eb;    /* Standard borders */
--border-muted: #f3f4f6;      /* Subtle dividers */
--border-strong: #d1d5db;     /* Emphasis borders */
--border-focus: #3b82f6;      /* Focus state */
--border-error: #ef4444;      /* Error state */
```

### Border Usage

```css
/* Standard border */
.border-default {
  border: 1px solid var(--border-default);
}

/* Stripe-style subtle card border */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  /* Note: shadow includes a subtle border effect */
}

/* Input borders */
.input {
  border: 1px solid var(--border-default);
  border-radius: 6px;
}

.input:focus {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

/* Dividers */
.divider {
  height: 1px;
  background: var(--border-default);
}
```

---

## Component Specifications

### Buttons

```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 6px;
  transition: all 150ms ease;
  cursor: pointer;
}

/* Primary button (Stripe blue style) */
.btn-primary {
  background: var(--primary-600);
  color: white;
  border: none;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.btn-primary:hover {
  background: var(--primary-700);
}

.btn-primary:focus {
  box-shadow: var(--shadow-focus);
}

/* Secondary button */
.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--border-default);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--border-strong);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  border: none;
}

.btn-ghost:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

/* Destructive button */
.btn-destructive {
  background: var(--error-600);
  color: white;
  border: none;
}

.btn-destructive:hover {
  background: var(--error-700);
}

/* Button sizes */
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-lg {
  padding: 12px 20px;
  font-size: 15px;
}

.btn-xl {
  padding: 16px 24px;
  font-size: 16px;
  min-height: 56px; /* Elder mode / accessibility */
}
```

### Inputs

```css
/* Base input */
.input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-900);
  background: white;
  border: 1px solid var(--border-default);
  border-radius: 6px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input::placeholder {
  color: var(--gray-400);
}

.input:hover {
  border-color: var(--border-strong);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

.input:disabled {
  background: var(--gray-50);
  color: var(--gray-400);
  cursor: not-allowed;
}

/* Input with error */
.input-error {
  border-color: var(--error-500);
}

.input-error:focus {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--error-500);
}

/* Input sizes */
.input-lg {
  padding: 14px 16px;
  font-size: 16px;
}
```

### Cards

```css
/* Base card (Stripe style) */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
}

/* Card with padding */
.card-padded {
  padding: 24px;
}

/* Interactive card */
.card-interactive {
  cursor: pointer;
  transition: box-shadow 150ms ease;
}

.card-interactive:hover {
  box-shadow: var(--shadow-card-hover);
}

/* Card sections */
.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-default);
}

.card-body {
  padding: 24px;
}

.card-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-default);
  background: var(--gray-50);
  border-radius: 0 0 8px 8px;
}
```

### Tables

```css
/* Stripe-style table */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-500);
  background: var(--gray-50);
  border-bottom: 1px solid var(--border-default);
}

.table td {
  padding: 16px;
  font-size: 14px;
  color: var(--gray-700);
  border-bottom: 1px solid var(--border-default);
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover {
  background: var(--gray-50);
}

/* Clickable rows */
.table tr.clickable {
  cursor: pointer;
}

.table tr.clickable:hover {
  background: var(--primary-50);
}
```

### Badges

```css
/* Base badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

/* Status badges */
.badge-success {
  background: var(--success-50);
  color: var(--success-700);
}

.badge-warning {
  background: var(--warning-50);
  color: var(--warning-700);
}

.badge-error {
  background: var(--error-50);
  color: var(--error-700);
}

.badge-info {
  background: var(--info-50);
  color: var(--info-700);
}

.badge-neutral {
  background: var(--gray-100);
  color: var(--gray-700);
}

/* Badge with dot indicator */
.badge-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
```

---

## Layout Patterns

### Page Layout

```tsx
// Standard page layout
<div className="min-h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
    {/* ... */}
  </aside>
  
  {/* Main content */}
  <main className="ml-64">
    {/* Top bar */}
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200">
      {/* ... */}
    </header>
    
    {/* Page content */}
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Page Title</h1>
        <p className="text-gray-500 mt-1">Page description</p>
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {/* Cards, tables, etc. */}
      </div>
    </div>
  </main>
</div>
```

### Card Grid

```tsx
// Stat cards grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Today's Rides" value={42} />
  <StatCard title="Active Now" value={8} />
  <StatCard title="Completed" value={31} />
  <StatCard title="Revenue" value="$3,240" />
</div>
```

### Form Layout

```tsx
// Stripe-style form
<form className="space-y-6 max-w-xl">
  {/* Section */}
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
    
    {/* Two columns */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input type="text" className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input type="text" className="input" />
      </div>
    </div>
    
    {/* Full width */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      <input type="tel" className="input" />
      <p className="text-sm text-gray-500 mt-1">
        We'll send ride updates to this number
      </p>
    </div>
  </div>
  
  {/* Divider */}
  <div className="border-t border-gray-200" />
  
  {/* Another section */}
  <div className="space-y-4">
    <h3 className="text-lg font-medium text-gray-900">Medical Needs</h3>
    {/* ... */}
  </div>
  
  {/* Actions */}
  <div className="flex justify-end gap-3 pt-4">
    <button type="button" className="btn btn-secondary">Cancel</button>
    <button type="submit" className="btn btn-primary">Save Patient</button>
  </div>
</form>
```

---

## Animation & Transitions

### Transition Timing

```css
/* Standard transitions */
--transition-fast: 100ms ease;
--transition-default: 150ms ease;
--transition-slow: 200ms ease;
--transition-slower: 300ms ease;

/* What to transition */
.interactive {
  transition: 
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    color 150ms ease,
    transform 150ms ease;
}
```

### Micro-interactions

```css
/* Button press effect */
.btn:active {
  transform: scale(0.98);
}

/* Card hover lift */
.card-interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-hover);
}

/* Subtle fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 150ms ease;
}

/* Slide up (for toasts, modals) */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(8px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 200ms ease;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Iconography

### Icon Style
- **Library:** Lucide React (clean, consistent with Stripe aesthetic)
- **Size:** 16px (small), 20px (default), 24px (large)
- **Stroke:** 1.5px - 2px
- **Color:** Inherit from text color

### Common Icons

| Use | Icon | Size |
|-----|------|------|
| Wheelchair | `Accessibility` or custom | 20px |
| Stretcher | `BedDouble` | 20px |
| Oxygen | `Wind` | 20px |
| Vehicle | `Car` | 20px |
| Patient | `User` | 20px |
| Facility | `Building2` | 20px |
| Phone | `Phone` | 16px |
| Location | `MapPin` | 16px |
| Time | `Clock` | 16px |
| Calendar | `Calendar` | 16px |
| Payment | `CreditCard` | 16px |
| Success | `CheckCircle` | 20px |
| Error | `XCircle` | 20px |
| Warning | `AlertTriangle` | 20px |
| Info | `Info` | 20px |
| Add | `Plus` | 16px |
| Edit | `Pencil` | 16px |
| Delete | `Trash2` | 16px |
| Search | `Search` | 16px |
| Filter | `Filter` | 16px |
| More | `MoreHorizontal` | 16px |
| Arrow | `ChevronRight` | 16px |
| External | `ExternalLink` | 14px |

---

## Responsive Breakpoints

```css
/* Mobile first */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

### Layout Changes

| Breakpoint | Sidebar | Content | Cards |
|------------|---------|---------|-------|
| < 768px | Hidden (drawer) | Full width | Stack |
| 768px - 1024px | Collapsed (icons) | With margin | 2 columns |
| > 1024px | Expanded | With margin | 4 columns |

---

## Implementation with Tailwind

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Override grays with warmer tones
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.5' }],
        'lg': ['16px', { lineHeight: '1.6' }],
        'xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'card': '0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'card-hover': '0 0 0 1px rgb(0 0 0 / 0.05), 0 4px 12px 0 rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Quick Reference Card

### Colors to Remember
- Page bg: `bg-gray-50`
- Cards: `bg-white shadow-card rounded-lg`
- Primary button: `bg-primary-600 hover:bg-primary-700`
- Text: `text-gray-800` (primary), `text-gray-500` (secondary)
- Borders: `border-gray-200`

### Spacing to Remember
- Card padding: `p-6` (24px)
- Between sections: `space-y-8` (32px)
- Between form fields: `space-y-4` (16px)
- Button padding: `px-4 py-2`

### Radius to Remember
- Buttons/inputs: `rounded-md` (6px)
- Cards: `rounded-lg` (8px)
- Modals: `rounded-xl` (12px)

---

*This is your visual bible. Every component should follow these specs.*
