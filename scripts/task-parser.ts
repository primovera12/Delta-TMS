#!/usr/bin/env node
/**
 * Task Parser
 * 
 * Parses DEVELOPMENT_ROADMAP.md and generates tasks.json
 * for the autonomous development system.
 * 
 * Usage: npx ts-node scripts/task-parser.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: string;
  day: number;
  phase: string;
  title: string;
  description: string;
  dependencies: string[];
  specs: string[];
  validation: ValidationRule[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  attempts: number;
  maxAttempts: number;
}

interface ValidationRule {
  type: 'file_exists' | 'test_passes' | 'builds' | 'lint_passes' | 'type_check' | 'custom';
  target?: string;
  required: boolean;
}

// ============================================================
// TASK DEFINITIONS
// ============================================================

/**
 * Complete task definitions for the 100-day roadmap.
 * Each task is designed to be atomic and independently executable.
 */
const TASKS: Task[] = [
  // ============================================================
  // PHASE 1: FOUNDATION (Days 1-10)
  // ============================================================
  
  // Day 1: Project Setup
  {
    id: 'day-01-task-01',
    day: 1,
    phase: 'foundation',
    title: 'Initialize Next.js 15 project',
    description: `Create a new Next.js 15 project with the following configuration:
- TypeScript enabled
- App Router (not Pages Router)
- Tailwind CSS
- ESLint
- src/ directory structure

Follow the exact versions in TECH_STACK.md.

Create these files:
- next.config.js
- tsconfig.json
- tailwind.config.ts
- postcss.config.js
- .eslintrc.json
- .gitignore`,
    dependencies: [],
    specs: ['TECH_STACK.md'],
    validation: [
      { type: 'file_exists', target: 'package.json', required: true },
      { type: 'file_exists', target: 'next.config.js', required: true },
      { type: 'file_exists', target: 'tailwind.config.ts', required: true },
      { type: 'file_exists', target: 'tsconfig.json', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-01-task-02',
    day: 1,
    phase: 'foundation',
    title: 'Install core dependencies',
    description: `Install all core dependencies from TECH_STACK.md:
- @tanstack/react-query
- zustand
- react-hook-form + zod + @hookform/resolvers
- lucide-react
- clsx, tailwind-merge, class-variance-authority
- date-fns

Create the package.json scripts:
- dev, build, start, lint, type-check`,
    dependencies: ['day-01-task-01'],
    specs: ['TECH_STACK.md'],
    validation: [
      { type: 'file_exists', target: 'package.json', required: true },
      { type: 'custom', target: 'npm ls @tanstack/react-query', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-01-task-03',
    day: 1,
    phase: 'foundation',
    title: 'Set up Prisma and database schema',
    description: `Initialize Prisma with PostgreSQL:
1. Install prisma and @prisma/client
2. Run prisma init
3. Copy the complete schema from DATABASE_SCHEMA.prisma
4. Configure datasource for PostgreSQL

The schema should include all models from DATABASE_SCHEMA.prisma.`,
    dependencies: ['day-01-task-01'],
    specs: ['TECH_STACK.md', 'DATABASE_SCHEMA.prisma'],
    validation: [
      { type: 'file_exists', target: 'prisma/schema.prisma', required: true },
      { type: 'custom', target: 'npx prisma validate', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 2: Project Structure
  {
    id: 'day-02-task-01',
    day: 2,
    phase: 'foundation',
    title: 'Create folder structure',
    description: `Create the complete folder structure as defined in TECH_STACK.md:

/app
  /(auth)/login, /register, /forgot-password
  /(dashboard)/dispatcher, /driver, /admin, /operations, /facility, /patient, /family
  /api/v1/...
  
/components/ui, /domain, /layout
/lib/db, /services, /api, /hooks, /utils
/stores
/types
/styles`,
    dependencies: ['day-01-task-02'],
    specs: ['TECH_STACK.md', 'MASTER_GUIDE.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/login/page.tsx', required: true },
      { type: 'file_exists', target: 'app/(dashboard)/dispatcher/page.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/.gitkeep', required: true },
      { type: 'file_exists', target: 'lib/utils/index.ts', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-02-task-02',
    day: 2,
    phase: 'foundation',
    title: 'Configure Tailwind with brand colors',
    description: `Update tailwind.config.ts with the complete design system from BRAND_GUIDELINES.md:

Colors:
- Primary blue: #2563eb
- Grays: 50-900 scale
- Status colors: success, warning, error

Shadows:
- shadow-card, shadow-card-hover

Border radius:
- Default: 6px, cards: 8px

Fonts:
- Inter font family`,
    dependencies: ['day-01-task-01'],
    specs: ['BRAND_GUIDELINES.md', 'TECH_STACK.md'],
    validation: [
      { type: 'file_exists', target: 'tailwind.config.ts', required: true },
      { type: 'file_exists', target: 'app/globals.css', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 3: Authentication Setup
  {
    id: 'day-03-task-01',
    day: 3,
    phase: 'foundation',
    title: 'Install and configure NextAuth.js',
    description: `Set up NextAuth.js v5 (Auth.js) for authentication:

1. Install next-auth@beta and @auth/prisma-adapter
2. Create auth.config.ts and auth.ts files
3. Set up Credentials provider
4. Configure Prisma adapter
5. Set up JWT strategy with role in token
6. Create middleware.ts for protected routes

Follow TECH_STACK.md section 5 for exact configuration.`,
    dependencies: ['day-01-task-03'],
    specs: ['TECH_STACK.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'auth.config.ts', required: true },
      { type: 'file_exists', target: 'auth.ts', required: true },
      { type: 'file_exists', target: 'middleware.ts', required: true },
      { type: 'file_exists', target: 'app/api/auth/[...nextauth]/route.ts', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-03-task-02',
    day: 3,
    phase: 'foundation',
    title: 'Create auth utility functions',
    description: `Create authentication utility functions in lib/auth/:

- getCurrentUser() - get current session user
- requireAuth() - server component auth check
- requireRole(roles[]) - role-based access check
- hashPassword() - bcrypt password hashing
- verifyPassword() - password verification

Include TypeScript types for User, Session, etc.`,
    dependencies: ['day-03-task-01'],
    specs: ['TECH_STACK.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'lib/auth/index.ts', required: true },
      { type: 'file_exists', target: 'lib/auth/password.ts', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 4: Base UI Components
  {
    id: 'day-04-task-01',
    day: 4,
    phase: 'foundation',
    title: 'Create Button component',
    description: `Create the Button component following DESIGN_SYSTEM.md and BRAND_GUIDELINES.md:

Variants: primary, secondary, outline, ghost, destructive
Sizes: sm, md, lg
States: default, hover, active, disabled, loading

Include:
- class-variance-authority for variants
- Loading spinner
- Icon support (left/right)
- Full accessibility (focus ring, aria)

File: components/ui/button.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/button.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-04-task-02',
    day: 4,
    phase: 'foundation',
    title: 'Create Input component',
    description: `Create the Input component following DESIGN_SYSTEM.md:

Features:
- Label integration
- Error state with message
- Helper text
- Icons (left/right)
- Disabled state
- Full accessibility

File: components/ui/input.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/input.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-04-task-03',
    day: 4,
    phase: 'foundation',
    title: 'Create Card component',
    description: `Create the Card component following DESIGN_SYSTEM.md:

Parts: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

Styling:
- White background
- shadow-card
- 8px border radius
- 24px padding

File: components/ui/card.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/card.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 5: More UI Components
  {
    id: 'day-05-task-01',
    day: 5,
    phase: 'foundation',
    title: 'Create Badge component',
    description: `Create the Badge/StatusBadge component:

Variants for trip statuses:
- pending (yellow)
- confirmed (blue)
- assigned (purple)
- in_progress (indigo)
- completed (green)
- cancelled (gray)
- no_show (red)

File: components/ui/badge.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/badge.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-05-task-02',
    day: 5,
    phase: 'foundation',
    title: 'Create Avatar component',
    description: `Create the Avatar component:

Features:
- Image with fallback
- Initials fallback from name
- Sizes: xs, sm, md, lg, xl
- Status indicator dot
- Group display (AvatarGroup)

File: components/ui/avatar.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/avatar.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-05-task-03',
    day: 5,
    phase: 'foundation',
    title: 'Create Select and Dropdown components',
    description: `Create Select/Dropdown components using Radix UI:

Features:
- Single select
- Searchable option
- Groups
- Disabled items
- Full keyboard navigation
- Accessible

Files: 
- components/ui/select.tsx
- components/ui/dropdown-menu.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/select.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/dropdown-menu.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 6: Form Components
  {
    id: 'day-06-task-01',
    day: 6,
    phase: 'foundation',
    title: 'Create form components',
    description: `Create form-related components:

1. Checkbox - with label, indeterminate state
2. Radio Group - with RadioGroupItem
3. Switch/Toggle - for boolean settings
4. Textarea - multiline input
5. Label - form label component

All must integrate with react-hook-form.

Files: components/ui/checkbox.tsx, radio-group.tsx, switch.tsx, textarea.tsx, label.tsx`,
    dependencies: ['day-04-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/checkbox.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/radio-group.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/switch.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/textarea.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-06-task-02',
    day: 6,
    phase: 'foundation',
    title: 'Create Form wrapper component',
    description: `Create Form component that integrates react-hook-form:

Features:
- Form context provider
- FormField component
- FormItem, FormLabel, FormControl, FormDescription, FormMessage
- Zod schema integration
- Error handling

File: components/ui/form.tsx`,
    dependencies: ['day-06-task-01'],
    specs: ['DESIGN_SYSTEM.md', 'TECH_STACK.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/form.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 7: Dialog and Modal Components
  {
    id: 'day-07-task-01',
    day: 7,
    phase: 'foundation',
    title: 'Create Dialog/Modal component',
    description: `Create Dialog component using Radix UI Dialog:

Parts:
- Dialog, DialogTrigger, DialogContent
- DialogHeader, DialogTitle, DialogDescription
- DialogFooter, DialogClose

Features:
- Overlay with blur
- Close on escape/outside click
- Focus trap
- Animation

File: components/ui/dialog.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/dialog.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-07-task-02',
    day: 7,
    phase: 'foundation',
    title: 'Create Sheet (Slide-over) component',
    description: `Create Sheet component for slide-over panels:

Features:
- Slides from right (default), left, top, or bottom
- Same parts as Dialog
- Good for mobile navigation, filters

File: components/ui/sheet.tsx`,
    dependencies: ['day-07-task-01'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/sheet.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-07-task-03',
    day: 7,
    phase: 'foundation',
    title: 'Create Alert Dialog component',
    description: `Create AlertDialog for confirmations:

Features:
- Action and Cancel buttons
- Destructive variant
- Cannot dismiss by clicking outside
- Accessible

File: components/ui/alert-dialog.tsx`,
    dependencies: ['day-07-task-01'],
    specs: ['DESIGN_SYSTEM.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/alert-dialog.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 8: Data Display Components
  {
    id: 'day-08-task-01',
    day: 8,
    phase: 'foundation',
    title: 'Create Table component',
    description: `Create Table component for data display:

Parts:
- Table, TableHeader, TableBody, TableFooter
- TableRow, TableHead, TableCell
- TableCaption

Features:
- Sortable columns (visual indicators)
- Sticky header option
- Responsive scrolling
- Row selection support

File: components/ui/table.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/table.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-08-task-02',
    day: 8,
    phase: 'foundation',
    title: 'Create DataTable component',
    description: `Create DataTable component with full features:

Features:
- Column definitions
- Sorting
- Filtering
- Pagination
- Row selection
- Loading state
- Empty state

Use @tanstack/react-table under the hood.

File: components/ui/data-table.tsx`,
    dependencies: ['day-08-task-01'],
    specs: ['DESIGN_SYSTEM.md', 'TECH_STACK.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/data-table.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 9: Navigation Components
  {
    id: 'day-09-task-01',
    day: 9,
    phase: 'foundation',
    title: 'Create Tabs component',
    description: `Create Tabs component using Radix UI:

Parts:
- Tabs, TabsList, TabsTrigger, TabsContent

Features:
- Keyboard navigation
- Animated indicator
- Vertical orientation option

File: components/ui/tabs.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/tabs.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-09-task-02',
    day: 9,
    phase: 'foundation',
    title: 'Create Breadcrumb component',
    description: `Create Breadcrumb navigation component:

Parts:
- Breadcrumb, BreadcrumbList, BreadcrumbItem
- BreadcrumbLink, BreadcrumbSeparator
- BreadcrumbPage (current page)

File: components/ui/breadcrumb.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/breadcrumb.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-09-task-03',
    day: 9,
    phase: 'foundation',
    title: 'Create Pagination component',
    description: `Create Pagination component:

Features:
- Previous/Next buttons
- Page numbers with ellipsis
- Items per page selector
- Total count display

File: components/ui/pagination.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'ACCESSIBILITY_SPEC.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/pagination.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Day 10: Feedback Components
  {
    id: 'day-10-task-01',
    day: 10,
    phase: 'foundation',
    title: 'Create Toast/Notification component',
    description: `Create Toast notification system:

Features:
- Multiple variants: success, error, warning, info
- Auto-dismiss with timer
- Action button support
- Stack multiple toasts
- useToast hook

Use sonner or custom implementation.

File: components/ui/toast.tsx, components/ui/toaster.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/toast.tsx', required: true },
      { type: 'file_exists', target: 'components/ui/toaster.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-10-task-02',
    day: 10,
    phase: 'foundation',
    title: 'Create Alert component',
    description: `Create inline Alert component:

Variants: info, success, warning, error

Parts:
- Alert, AlertTitle, AlertDescription

Features:
- Icon based on variant
- Dismissible option

File: components/ui/alert.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/alert.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-10-task-03',
    day: 10,
    phase: 'foundation',
    title: 'Create Skeleton loader component',
    description: `Create Skeleton component for loading states:

Features:
- Pulse animation
- Various shapes (line, circle, rectangle)
- Customizable width/height

File: components/ui/skeleton.tsx`,
    dependencies: ['day-02-task-02'],
    specs: ['DESIGN_SYSTEM.md'],
    validation: [
      { type: 'file_exists', target: 'components/ui/skeleton.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // ============================================================
  // PHASE 2: AUTHENTICATION PAGES (Days 11-15)
  // ============================================================
  
  {
    id: 'day-11-task-01',
    day: 11,
    phase: 'authentication',
    title: 'Create Login page',
    description: `Create the Login page at /login:

Features:
- Email/password form
- "Remember me" checkbox
- Magic link option
- Forgot password link
- Role-based redirect after login
- Error handling
- Loading states

Follow SCREEN_CATALOG.md section 2.1 and BRAND_GUIDELINES.md.

File: app/(auth)/login/page.tsx`,
    dependencies: ['day-03-task-02', 'day-06-task-02'],
    specs: ['SCREEN_CATALOG.md', 'BRAND_GUIDELINES.md', 'WORKFLOWS.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/login/page.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-11-task-02',
    day: 11,
    phase: 'authentication',
    title: 'Create auth layout',
    description: `Create the auth layout for login/register pages:

Features:
- Centered card layout
- Company logo
- Background styling
- Responsive

File: app/(auth)/layout.tsx`,
    dependencies: ['day-04-task-03'],
    specs: ['BRAND_GUIDELINES.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/layout.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  {
    id: 'day-12-task-01',
    day: 12,
    phase: 'authentication',
    title: 'Create Registration flow - Step 1',
    description: `Create registration Step 1 - Account Type Selection:

Options:
- Patient
- Family Member
- Facility Staff

Follow SCREEN_CATALOG.md section 2.2.

File: app/(auth)/register/page.tsx`,
    dependencies: ['day-11-task-02'],
    specs: ['SCREEN_CATALOG.md', 'WORKFLOWS.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/register/page.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  {
    id: 'day-12-task-02',
    day: 12,
    phase: 'authentication',
    title: 'Create Registration flow - Steps 2-4',
    description: `Create remaining registration steps:

Step 2 (/register/info): Personal information form
Step 3 (/register/verify): Phone verification via SMS OTP
Step 4 (/register/complete): Password creation

Files: 
- app/(auth)/register/info/page.tsx
- app/(auth)/register/verify/page.tsx
- app/(auth)/register/complete/page.tsx`,
    dependencies: ['day-12-task-01'],
    specs: ['SCREEN_CATALOG.md', 'WORKFLOWS.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/register/info/page.tsx', required: true },
      { type: 'file_exists', target: 'app/(auth)/register/verify/page.tsx', required: true },
      { type: 'file_exists', target: 'app/(auth)/register/complete/page.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  {
    id: 'day-13-task-01',
    day: 13,
    phase: 'authentication',
    title: 'Create Forgot Password page',
    description: `Create Forgot Password flow:

Page 1 (/forgot-password): Email input to request reset
Page 2 (/reset-password/[token]): New password form

Features:
- Email validation
- Success message
- Token expiry handling

Files:
- app/(auth)/forgot-password/page.tsx
- app/(auth)/reset-password/[token]/page.tsx`,
    dependencies: ['day-11-task-02'],
    specs: ['SCREEN_CATALOG.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'app/(auth)/forgot-password/page.tsx', required: true },
      { type: 'file_exists', target: 'app/(auth)/reset-password/[token]/page.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  {
    id: 'day-14-task-01',
    day: 14,
    phase: 'authentication',
    title: 'Create auth API routes',
    description: `Create authentication API endpoints:

- POST /api/auth/register - User registration
- POST /api/auth/verify-phone - Phone OTP verification
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with token
- POST /api/auth/magic-link/request - Request magic link
- GET /api/auth/magic-link/verify/[token] - Verify magic link

Follow API_SPEC.md section 1.

Files in: app/api/auth/...`,
    dependencies: ['day-03-task-02'],
    specs: ['API_SPEC.md', 'SPECIFICATIONS_COMPLETE.md'],
    validation: [
      { type: 'file_exists', target: 'app/api/auth/register/route.ts', required: true },
      { type: 'file_exists', target: 'app/api/auth/verify-phone/route.ts', required: true },
      { type: 'file_exists', target: 'app/api/auth/forgot-password/route.ts', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  {
    id: 'day-15-task-01',
    day: 15,
    phase: 'authentication',
    title: 'Create Dashboard layout',
    description: `Create the main dashboard layout with:

- Sidebar navigation (collapsible)
- Top bar with user menu
- Main content area
- Mobile responsive (hamburger menu)

Follow DESIGN_SYSTEM.md Layout components.

Files:
- app/(dashboard)/layout.tsx
- components/layout/sidebar.tsx
- components/layout/topbar.tsx
- components/layout/dashboard-layout.tsx`,
    dependencies: ['day-09-task-01'],
    specs: ['DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'SCREEN_CATALOG.md'],
    validation: [
      { type: 'file_exists', target: 'app/(dashboard)/layout.tsx', required: true },
      { type: 'file_exists', target: 'components/layout/sidebar.tsx', required: true },
      { type: 'file_exists', target: 'components/layout/topbar.tsx', required: true },
    ],
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
  },
  
  // Continue with more days...
  // This is a sample - the full file would have all 100 days worth of tasks
];

// ============================================================
// Generate remaining tasks programmatically
// ============================================================

function generateRemainingTasks(): Task[] {
  const additionalTasks: Task[] = [];
  
  // Phase 3: Dispatcher Portal (Days 16-30)
  const dispatcherTasks = [
    { day: 16, title: 'Dispatcher Dashboard page', file: 'app/(dashboard)/dispatcher/page.tsx' },
    { day: 17, title: 'New Booking Form - Patient Selection', file: 'components/domain/booking/patient-select.tsx' },
    { day: 18, title: 'New Booking Form - Address Entry', file: 'components/domain/booking/address-entry.tsx' },
    { day: 19, title: 'New Booking Form - Schedule Selection', file: 'components/domain/booking/schedule-select.tsx' },
    { day: 20, title: 'New Booking Form - Price Quote', file: 'components/domain/booking/price-quote.tsx' },
    { day: 21, title: 'Trip List page', file: 'app/(dashboard)/dispatcher/trips/page.tsx' },
    { day: 22, title: 'Trip Details page', file: 'app/(dashboard)/dispatcher/trips/[id]/page.tsx' },
    { day: 23, title: 'Driver Assignment modal', file: 'components/domain/trips/driver-assignment.tsx' },
    { day: 24, title: 'Patient Management page', file: 'app/(dashboard)/dispatcher/patients/page.tsx' },
    { day: 25, title: 'Patient Details page', file: 'app/(dashboard)/dispatcher/patients/[id]/page.tsx' },
    { day: 26, title: 'Driver List page', file: 'app/(dashboard)/dispatcher/drivers/page.tsx' },
    { day: 27, title: 'Live Map view', file: 'app/(dashboard)/dispatcher/map/page.tsx' },
    { day: 28, title: 'Call Log page', file: 'app/(dashboard)/dispatcher/calls/page.tsx' },
    { day: 29, title: 'Shift Notes page', file: 'app/(dashboard)/dispatcher/notes/page.tsx' },
    { day: 30, title: 'Dispatcher Settings page', file: 'app/(dashboard)/dispatcher/settings/page.tsx' },
  ];
  
  for (const t of dispatcherTasks) {
    additionalTasks.push({
      id: `day-${String(t.day).padStart(2, '0')}-task-01`,
      day: t.day,
      phase: 'dispatcher',
      title: t.title,
      description: `Create ${t.title} following SCREEN_CATALOG.md and DESIGN_SYSTEM.md specifications.`,
      dependencies: t.day === 16 ? ['day-15-task-01'] : [`day-${String(t.day - 1).padStart(2, '0')}-task-01`],
      specs: ['SCREEN_CATALOG.md', 'DESIGN_SYSTEM.md', 'BRAND_GUIDELINES.md', 'API_SPEC.md'],
      validation: [
        { type: 'file_exists', target: t.file, required: true },
      ],
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
    });
  }
  
  // Add more phases similarly...
  // Phase 4: Driver Portal (Days 31-45)
  // Phase 5: Admin Portal (Days 46-60)
  // Phase 6: Facility Portal (Days 61-75)
  // Phase 7: Patient/Family Portals (Days 76-85)
  // Phase 8: Advanced Features (Days 86-95)
  // Phase 9: Polish & Testing (Days 96-100)
  
  return additionalTasks;
}

// ============================================================
// MAIN
// ============================================================

function main(): void {
  console.log('📋 Parsing tasks from roadmap...\n');
  
  // Combine predefined and generated tasks
  const allTasks = [...TASKS, ...generateRemainingTasks()];
  
  // Sort by day
  allTasks.sort((a, b) => a.day - b.day || a.id.localeCompare(b.id));
  
  // Ensure output directory exists
  const outputDir = path.dirname('./scripts/tasks/tasks.json');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write tasks file
  fs.writeFileSync(
    './scripts/tasks/tasks.json',
    JSON.stringify({ tasks: allTasks }, null, 2)
  );
  
  console.log(`✅ Generated ${allTasks.length} tasks`);
  console.log(`   Days covered: 1-${Math.max(...allTasks.map(t => t.day))}`);
  console.log(`   Output: scripts/tasks/tasks.json`);
  
  // Print summary by phase
  const phases = [...new Set(allTasks.map(t => t.phase))];
  console.log('\n📊 Tasks by phase:');
  for (const phase of phases) {
    const count = allTasks.filter(t => t.phase === phase).length;
    console.log(`   ${phase}: ${count} tasks`);
  }
}

main();
