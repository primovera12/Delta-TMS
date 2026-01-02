# Accessibility Specification - Wheelchair Transportation Platform

> **Target Users:** Elderly patients, people with disabilities, caregivers
> **Compliance:** WCAG 2.1 AA (minimum), AAA where feasible
> **Last Updated:** January 2026

---

## Table of Contents

1. [Accessibility Philosophy](#1-accessibility-philosophy)
2. [Elder Mode](#2-elder-mode)
3. [Visual Accessibility](#3-visual-accessibility)
4. [Motor Accessibility](#4-motor-accessibility)
5. [Cognitive Accessibility](#5-cognitive-accessibility)
6. [Screen Reader Support](#6-screen-reader-support)
7. [Keyboard Navigation](#7-keyboard-navigation)
8. [Voice Control](#8-voice-control)
9. [Component-Specific Guidelines](#9-component-specific-guidelines)
10. [Testing Requirements](#10-testing-requirements)

---

## 1. Accessibility Philosophy

### Core Principles

1. **Inclusive by Default**
   - Accessibility is not an add-on feature
   - Build accessible from Day 1, not retrofitted
   - The default experience should work for everyone

2. **Respect User Preferences**
   - Honor system-level accessibility settings
   - Allow user customization within the app
   - Remember preferences across sessions

3. **Graceful Degradation**
   - Core functions work without JavaScript
   - Works on older devices and browsers
   - Works on slow connections

4. **Clear Over Clever**
   - Simple, predictable interactions
   - No hidden gestures or features
   - Obvious feedback for every action

### User Personas to Design For

| Persona | Challenges | Needs |
|---------|------------|-------|
| **Martha, 78** | Low vision, arthritis | Large text, big buttons, simple flows |
| **Robert, 65** | Early dementia | Clear language, minimal choices, confirmation |
| **Sarah, 45** | Legally blind | Full screen reader support |
| **James, 52** | Wheelchair user, limited hand mobility | Voice control, large touch targets |
| **Linda, 70** | Hearing impaired | Visual alerts, no audio-only info |
| **Tom, 80** | Technology anxiety | Reassuring feedback, help always available |

---

## 2. Elder Mode

### What is Elder Mode?

A simplified, large-format interface designed specifically for elderly users. Can be:
- Enabled by user in settings
- Enabled by family member/caregiver
- Suggested based on user profile (age 65+)

### Elder Mode Features

#### Visual Changes
```css
/* Normal Mode */
--text-base: 16px;
--button-height: 40px;
--touch-target: 44px;

/* Elder Mode */
--text-base: 20px;        /* 25% larger */
--text-lg: 24px;
--button-height: 56px;    /* 40% larger */
--touch-target: 56px;     /* Exceeds WCAG */
--line-height: 1.8;       /* More readable */
--letter-spacing: 0.02em; /* Slightly spaced */
```

#### Layout Changes
- **Single column layouts** on all screen sizes
- **More whitespace** between elements
- **Larger icons** (32px minimum)
- **Sticky headers** with current location
- **Always visible navigation** (no hamburger menu)

#### Interaction Changes
- **No hover states** (assume touch)
- **No double-tap** requirements
- **No swipe gestures** required (buttons instead)
- **No timeouts** on forms
- **Auto-save** form progress
- **Confirmation on every action**

#### Content Changes
- **Simplified language** (8th grade reading level)
- **Shorter sentences** (max 15 words)
- **No jargon** or technical terms
- **Larger form labels** above inputs
- **Step-by-step instructions**

### Elder Mode Toggle

```tsx
// In user settings and accessible from any page
<ElderModeToggle />

// Stored in:
// - User preference in database
// - Local storage for immediate effect
// - Applied via CSS class on <html> element
```

### Elder Mode Implementation

```tsx
// contexts/AccessibilityContext.tsx
interface AccessibilitySettings {
  elderMode: boolean;
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
}

// Apply to root element
<html 
  className={cn(
    settings.elderMode && 'elder-mode',
    settings.highContrast && 'high-contrast',
    `text-size-${settings.textSize}`
  )}
  data-reduced-motion={settings.reducedMotion}
>
```

---

## 3. Visual Accessibility

### Text Sizing

#### Size Scale

| Level | Normal | Large | Extra Large | Use Case |
|-------|--------|-------|-------------|----------|
| xs | 12px | 14px | 16px | Timestamps, labels |
| sm | 14px | 16px | 18px | Secondary text |
| base | 16px | 20px | 24px | Body text |
| lg | 18px | 22px | 28px | Subheadings |
| xl | 20px | 26px | 32px | Headings |
| 2xl | 24px | 32px | 40px | Page titles |

#### Implementation

```css
/* Base sizes respond to user preference */
html {
  font-size: 16px; /* Default */
}

html.text-size-large {
  font-size: 20px;
}

html.text-size-extra-large {
  font-size: 24px;
}

/* All sizes use rem so they scale */
.text-body {
  font-size: 1rem;
  line-height: 1.6;
}
```

### Color Contrast

#### Minimum Requirements

| Element | Ratio Required | Our Target |
|---------|---------------|------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 4.5:1 |
| Focus indicators | 3:1 | 4.5:1 |

#### Color Palette with Contrast Ratios

```css
/* Primary text on white background */
--text-primary: #1a1a1a;     /* 16.1:1 ✓ */
--text-secondary: #4a4a4a;   /* 9.4:1 ✓ */
--text-muted: #6b6b6b;       /* 5.9:1 ✓ */

/* Status colors - all tested for contrast */
--status-success: #15803d;   /* 5.1:1 on white ✓ */
--status-warning: #b45309;   /* 5.3:1 on white ✓ */
--status-error: #b91c1c;     /* 6.2:1 on white ✓ */
--status-info: #1d4ed8;      /* 6.5:1 on white ✓ */

/* High contrast mode overrides */
.high-contrast {
  --text-primary: #000000;
  --text-secondary: #000000;
  --bg-primary: #ffffff;
  --border-default: #000000;
}
```

### High Contrast Mode

When enabled:
- Pure black text (#000000)
- Pure white backgrounds (#ffffff)
- Thick borders (2px minimum)
- No gradients or subtle shadows
- Underlines on all links
- Bold text for emphasis (not just color)

```css
.high-contrast {
  /* Remove all decorative elements */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  /* Strengthen borders */
  [class*="border"] {
    border-width: 2px !important;
    border-color: #000000 !important;
  }
  
  /* Ensure links are obvious */
  a {
    text-decoration: underline !important;
    text-decoration-thickness: 2px !important;
  }
  
  /* Focus states extra visible */
  :focus {
    outline: 3px solid #000000 !important;
    outline-offset: 2px !important;
  }
}
```

### Color Independence

**Never rely on color alone to convey information:**

```tsx
// ❌ Bad: Color only
<span className="text-red-500">Payment failed</span>

// ✅ Good: Color + icon + text
<span className="text-red-500 flex items-center gap-2">
  <XCircle className="w-5 h-5" aria-hidden="true" />
  <span>Payment failed</span>
</span>

// ✅ Good: Status badge with icon
<Badge variant="error">
  <XCircle className="w-4 h-4 mr-1" />
  Cancelled
</Badge>
```

### Icons

- **Always paired with text** for critical actions
- **Minimum 24px** size (32px in Elder Mode)
- **Sufficient stroke weight** (2px minimum)
- **aria-hidden="true"** when decorative
- **aria-label** when standalone

```tsx
// Decorative icon (has text label)
<Button>
  <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
  Call Patient
</Button>

// Standalone icon (needs label)
<Button variant="ghost" aria-label="Call patient">
  <Phone className="w-5 h-5" />
</Button>
```

---

## 4. Motor Accessibility

### Touch Targets

#### Minimum Sizes

| Mode | Minimum Size | Recommended |
|------|--------------|-------------|
| Normal | 44px × 44px | 48px × 48px |
| Elder Mode | 56px × 56px | 64px × 64px |

#### Spacing Between Targets

- **Minimum 8px** between clickable elements
- **16px recommended** in Elder Mode
- Prevents accidental taps

```css
/* Touch target enforcement */
button, 
a, 
[role="button"],
input[type="checkbox"],
input[type="radio"] {
  min-height: 44px;
  min-width: 44px;
}

.elder-mode button,
.elder-mode a,
.elder-mode [role="button"] {
  min-height: 56px;
  min-width: 56px;
  padding: 16px 24px;
}
```

### Click/Tap Areas

- **Entire row clickable** in lists (not just text)
- **Large checkbox/radio hit areas** (include label)
- **Button padding** extends clickable area

```tsx
// ❌ Bad: Small click target
<div>
  <input type="checkbox" id="wheelchair" />
  <label htmlFor="wheelchair">Wheelchair required</label>
</div>

// ✅ Good: Entire row is clickable
<label 
  htmlFor="wheelchair" 
  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 rounded-lg"
>
  <input type="checkbox" id="wheelchair" className="w-6 h-6" />
  <span className="text-lg">Wheelchair required</span>
</label>
```

### Gestures

#### Avoid These Gestures
- ❌ Swipe to delete
- ❌ Pinch to zoom (use buttons)
- ❌ Long press
- ❌ Double tap
- ❌ Drag and drop (provide alternative)

#### Provide Alternatives
```tsx
// Instead of swipe-to-delete
<div className="flex items-center justify-between">
  <span>Ride #TR-123</span>
  <Button variant="destructive" size="sm">
    Cancel Ride
  </Button>
</div>

// Instead of drag-and-drop calendar
<div className="flex gap-2">
  <Button onClick={moveEarlier}>← Earlier</Button>
  <Button onClick={moveLater}>Later →</Button>
</div>
```

### Form Interactions

- **Large input fields** (48px height minimum)
- **Clear focus states** (visible ring)
- **No auto-advance** between fields
- **Generous timeouts** (or none)
- **Easy error correction** (don't clear form on error)

```tsx
<Input
  className="h-12 text-lg px-4"
  // Large, easy to tap
/>

// No time limits on forms
// Auto-save progress
// "Are you still there?" instead of timeout logout
```

---

## 5. Cognitive Accessibility

### Language Guidelines

#### Reading Level
- **Target: 8th grade reading level**
- Use [Hemingway Editor](https://hemingwayapp.com/) to check
- Short sentences (15 words max)
- Common words only

#### Examples

| ❌ Don't Write | ✅ Write Instead |
|---------------|-----------------|
| "Your transportation request has been successfully processed" | "Your ride is booked!" |
| "Please authenticate using your credentials" | "Please sign in" |
| "The vehicle will arrive at the designated location" | "Your driver will arrive at [address]" |
| "Insufficient funds for transaction completion" | "Payment failed - not enough money on card" |
| "Navigate to the subsequent page" | "Go to next step" |

### Clear Instructions

```tsx
// ❌ Bad: Assumes knowledge
<Input placeholder="Enter pickup" />

// ✅ Good: Explicit instructions
<div>
  <Label>Where should we pick you up?</Label>
  <p className="text-sm text-muted mb-2">
    Enter the full address where the driver will meet you
  </p>
  <Input placeholder="123 Main Street, Houston, TX" />
</div>
```

### Reduce Choices

- **Maximum 5-7 options** per decision
- **Smart defaults** pre-selected
- **Progressive disclosure** (show more only when needed)

```tsx
// ❌ Bad: Too many choices at once
<Select>
  <option>Sedan</option>
  <option>SUV</option>
  <option>Van</option>
  <option>Wheelchair Van</option>
  <option>Stretcher Van</option>
  <option>Bariatric Vehicle</option>
  <option>Minivan</option>
  <option>Luxury Sedan</option>
</Select>

// ✅ Good: Simplified, most common first
<RadioGroup defaultValue="wheelchair">
  <RadioItem value="wheelchair">
    <WheelchairIcon />
    Wheelchair Van (most common)
  </RadioItem>
  <RadioItem value="stretcher">
    <BedIcon />
    Stretcher Van
  </RadioItem>
  <RadioItem value="bariatric">
    <ScaleIcon />
    Bariatric Vehicle
  </RadioItem>
</RadioGroup>
```

### Confirmation & Feedback

#### Every Action Gets Feedback

```tsx
// Success feedback
toast.success("Ride booked! Your driver will arrive at 10:00 AM");

// Loading feedback
<Button disabled>
  <Spinner className="mr-2" />
  Booking your ride...
</Button>

// Error feedback with help
toast.error(
  "Could not book ride",
  {
    description: "Your card was declined. Try a different card or call us for help.",
    action: <Button>Call Us</Button>
  }
);
```

#### Confirmation for Important Actions

```tsx
// Always confirm destructive actions
<AlertDialog>
  <AlertDialogTrigger>Cancel Ride</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Cancel this ride?</AlertDialogTitle>
      <AlertDialogDescription>
        Your ride on January 15 at 10:00 AM will be cancelled.
        You may be charged a $10 cancellation fee.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep My Ride</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600">
        Yes, Cancel Ride
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Progress Indicators

```tsx
// Multi-step forms show progress
<div className="mb-8">
  <div className="flex justify-between mb-2">
    <span className="text-lg font-medium">Step 2 of 5</span>
    <span className="text-muted">Pickup Address</span>
  </div>
  <Progress value={40} className="h-3" />
</div>

// What's next is clear
<div className="text-center text-muted mt-4">
  Next: Choose drop-off location
</div>
```

### Error Prevention

```tsx
// Validate as user types (gently)
<Input
  type="phone"
  value={phone}
  onChange={(e) => setPhone(formatPhone(e.target.value))}
  // Auto-format: (555) 123-4567
/>

// Prevent impossible selections
<DatePicker
  minDate={new Date()} // Can't pick past dates
  maxDate={addDays(new Date(), 90)}
/>

// Warn before problems
{distanceMiles > 50 && (
  <Alert variant="warning">
    <AlertTitle>Long distance ride</AlertTitle>
    <AlertDescription>
      This is a 50+ mile trip. Please confirm this is correct.
    </AlertDescription>
  </Alert>
)}
```

---

## 6. Screen Reader Support

### Semantic HTML

```tsx
// ✅ Use semantic elements
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>

<article>...</article>
<section>...</section>
<aside>...</aside>

// ✅ Use proper heading hierarchy
<h1>Dashboard</h1>
  <h2>Today's Rides</h2>
    <h3>Ride #TR-123</h3>
  <h2>Quick Actions</h2>
```

### ARIA Labels

```tsx
// Label for icon-only buttons
<Button aria-label="Call patient John Smith">
  <Phone />
</Button>

// Label for search
<Input 
  type="search"
  aria-label="Search patients by name or phone"
  placeholder="Search..."
/>

// Label for regions
<section aria-label="Upcoming rides">
  ...
</section>
```

### Live Regions

```tsx
// Announce dynamic updates
<div 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>

// Announce urgent updates
<div 
  aria-live="assertive" 
  role="alert"
>
  {errorMessage}
</div>
```

### Form Accessibility

```tsx
<form>
  {/* Associate labels with inputs */}
  <div>
    <Label htmlFor="patient-name">Patient Name</Label>
    <Input 
      id="patient-name"
      aria-describedby="patient-name-help patient-name-error"
    />
    <p id="patient-name-help" className="text-sm text-muted">
      Enter the patient's full legal name
    </p>
    {error && (
      <p id="patient-name-error" className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>

  {/* Announce required fields */}
  <Input 
    required
    aria-required="true"
  />

  {/* Announce field state */}
  <Input 
    aria-invalid={hasError}
  />
</form>
```

### Table Accessibility

```tsx
<table>
  <caption className="sr-only">Today's scheduled rides</caption>
  <thead>
    <tr>
      <th scope="col">Ride Number</th>
      <th scope="col">Patient</th>
      <th scope="col">Time</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">TR-123</th>
      <td>John Smith</td>
      <td>10:00 AM</td>
      <td>Confirmed</td>
    </tr>
  </tbody>
</table>
```

### Skip Links

```tsx
// At very top of page
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border"
>
  Skip to main content
</a>

// ... header/nav ...

<main id="main-content" tabIndex={-1}>
  ...
</main>
```

---

## 7. Keyboard Navigation

### Focus Management

```tsx
// Visible focus ring on all interactive elements
:focus-visible {
  outline: 3px solid var(--focus-ring-color);
  outline-offset: 2px;
}

// Don't remove focus outlines
:focus {
  outline: none; // ❌ NEVER DO THIS
}
```

### Tab Order

- **Logical order** follows visual layout
- **No positive tabindex** (only 0 or -1)
- **Skip links** at top of page
- **Focus trap** in modals

```tsx
// Modal focus trap
<Dialog>
  <DialogContent>
    {/* Focus stays within modal */}
    {/* First focusable element gets focus on open */}
    {/* Escape closes modal */}
    {/* Focus returns to trigger on close */}
  </DialogContent>
</Dialog>
```

### Keyboard Shortcuts

```tsx
// Document shortcuts (show in help)
const SHORTCUTS = {
  'n': 'New ride',
  'f': 'Focus search',
  '?': 'Show keyboard shortcuts',
  'Escape': 'Close modal/cancel',
};

// Show shortcut hints on hover (desktop)
<Button>
  New Ride
  <kbd className="ml-2 text-xs opacity-50">N</kbd>
</Button>

// Keyboard shortcut handler
useHotkeys('n', () => openNewRideForm());
useHotkeys('f', () => searchInput.current?.focus());
useHotkeys('?', () => setShowShortcutsHelp(true));
```

### Common Patterns

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter/Space | Activate button/link |
| Escape | Close modal, cancel action |
| Arrow keys | Navigate within components (menus, tabs) |

---

## 8. Voice Control

### Voice Command Support

For users with motor impairments who use voice control software (Dragon, Voice Control).

#### Label Everything

```tsx
// All buttons have visible text or aria-label
// Voice users say "Click [label]"

<Button>Book Ride</Button>
// Voice: "Click Book Ride"

<Button aria-label="Call John Smith">
  <Phone />
</Button>
// Voice: "Click Call John Smith"
```

#### Unique Labels

```tsx
// ❌ Bad: Multiple "View" buttons
<Button>View</Button>
<Button>View</Button>
<Button>View</Button>

// ✅ Good: Unique labels
<Button>View Ride Details</Button>
<Button>View Patient Profile</Button>
<Button>View Driver Schedule</Button>
```

### Voice Input for Text

```tsx
// Enable browser speech recognition
<Input
  type="text"
  // Browser handles voice input via system settings
  // No custom implementation needed
/>

// Large microphone button for voice search (optional enhancement)
<div className="relative">
  <Input placeholder="Search patients..." />
  <Button 
    variant="ghost" 
    className="absolute right-2 top-1/2 -translate-y-1/2"
    aria-label="Search by voice"
  >
    <Mic className="w-5 h-5" />
  </Button>
</div>
```

---

## 9. Component-Specific Guidelines

### Buttons

```tsx
// Minimum requirements
<Button
  className="min-h-[44px] min-w-[44px] px-4"
  // Always has text content or aria-label
  // Clear hover/focus states
  // Loading state with spinner
  // Disabled state visually distinct
>
  {children}
</Button>
```

### Forms

```tsx
// Complete accessible form field
<div className="space-y-2">
  <Label htmlFor="pickup" className="text-base font-medium">
    Pickup Address
    <span className="text-red-500 ml-1" aria-hidden="true">*</span>
  </Label>
  
  <Input
    id="pickup"
    required
    aria-required="true"
    aria-invalid={!!errors.pickup}
    aria-describedby="pickup-help pickup-error"
    className="h-12 text-lg"
    placeholder="Enter full address"
  />
  
  <p id="pickup-help" className="text-sm text-muted-foreground">
    Enter the complete street address including city and state
  </p>
  
  {errors.pickup && (
    <p id="pickup-error" className="text-sm text-red-600" role="alert">
      <AlertCircle className="inline w-4 h-4 mr-1" />
      {errors.pickup.message}
    </p>
  )}
</div>
```

### Modals

```tsx
<Dialog>
  <DialogContent
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    // Focus trapped inside
    // Escape to close
    // Click outside to close (with confirmation for forms)
  >
    <DialogHeader>
      <DialogTitle id="dialog-title">Confirm Booking</DialogTitle>
      <DialogDescription id="dialog-description">
        Review your ride details before confirming.
      </DialogDescription>
    </DialogHeader>
    
    {/* Content */}
    
    <DialogFooter>
      {/* Cancel button first (left), confirm button second (right) */}
      <Button variant="outline">Cancel</Button>
      <Button>Confirm Booking</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tables

```tsx
// Responsive accessible table
<div className="overflow-x-auto" role="region" aria-label="Rides table" tabIndex={0}>
  <Table>
    <TableCaption>Today's scheduled rides</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Ride #</TableHead>
        <TableHead scope="col">Patient</TableHead>
        <TableHead scope="col">
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rides.map(ride => (
        <TableRow key={ride.id}>
          <TableHead scope="row">{ride.number}</TableHead>
          <TableCell>{ride.patient.name}</TableCell>
          <TableCell>
            <Button aria-label={`View details for ride ${ride.number}`}>
              View
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Navigation

```tsx
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <a 
        href="/dashboard"
        aria-current={isCurrentPage ? 'page' : undefined}
      >
        Dashboard
      </a>
    </li>
    {/* ... */}
  </ul>
</nav>
```

---

## 10. Testing Requirements

### Automated Testing

Run on every build:

```bash
# axe-core integration
npm install @axe-core/react

# In tests
import { axe } from 'jest-axe';

test('page has no accessibility violations', async () => {
  const { container } = render(<MyPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

#### Keyboard Testing
- [ ] Can complete all tasks using only keyboard
- [ ] Focus order is logical
- [ ] Focus is visible at all times
- [ ] No keyboard traps
- [ ] Modals trap focus correctly
- [ ] Skip links work

#### Screen Reader Testing
Test with:
- VoiceOver (Mac/iOS)
- NVDA (Windows, free)
- JAWS (Windows)

Checklist:
- [ ] All content is announced
- [ ] Headings are properly structured
- [ ] Links and buttons are labeled
- [ ] Form fields have labels
- [ ] Errors are announced
- [ ] Dynamic content updates announced

#### Visual Testing
- [ ] Works at 200% zoom
- [ ] Works at 400% zoom
- [ ] Works in high contrast mode
- [ ] Works in dark mode (future)
- [ ] Text is readable at all sizes
- [ ] No horizontal scroll at 320px width

#### Motor Testing
- [ ] All targets are 44px minimum
- [ ] No precision required (small targets)
- [ ] No time limits
- [ ] No complex gestures required

### Testing Tools

| Tool | Purpose |
|------|---------|
| axe DevTools | Automated accessibility testing |
| WAVE | Visual accessibility checker |
| Lighthouse | Accessibility audit |
| Color Contrast Analyzer | Check color ratios |
| Screen readers | Real user experience |
| Keyboard only | Motor accessibility |

### Testing Schedule

| Test Type | Frequency |
|-----------|-----------|
| Automated (axe) | Every PR |
| Lighthouse audit | Weekly |
| Manual keyboard test | Every new feature |
| Screen reader test | Every new feature |
| Full audit | Before each release |

---

## Accessibility Checklist for Every Feature

Before marking any feature complete:

- [ ] Color contrast meets AA (4.5:1 text, 3:1 UI)
- [ ] All interactive elements have 44px minimum target
- [ ] All images have alt text
- [ ] All form fields have labels
- [ ] Error messages are clear and associated
- [ ] Works with keyboard only
- [ ] Works with screen reader
- [ ] Works at 200% zoom
- [ ] No content relies on color alone
- [ ] Loading/dynamic content is announced
- [ ] Focus management is correct
- [ ] Passes automated axe tests

---

*Accessibility is not optional. It's how we serve our patients with dignity.*
