import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Brand Colors from BRAND_GUIDELINES.md
      colors: {
        // Primary - Deep Blue (Stripe-inspired, medical-trustworthy)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Neutral Colors - Slightly warm, not harsh
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
        // Success - Soft green
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        // Warning - Soft amber
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Error - Soft red
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Info - Soft blue
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Ride Status Colors
        status: {
          pending: '#f59e0b',
          confirmed: '#3b82f6',
          assigned: '#8b5cf6',
          'driver-on-way': '#06b6d4',
          'driver-arrived': '#10b981',
          'in-progress': '#22c55e',
          completed: '#16a34a',
          cancelled: '#ef4444',
          'no-show': '#dc2626',
        },
        // Driver Status Colors
        driver: {
          online: '#22c55e',
          offline: '#6b7280',
          busy: '#f59e0b',
          'on-trip': '#3b82f6',
          break: '#8b5cf6',
        },
        // Borders
        border: {
          DEFAULT: '#e5e7eb',
          muted: '#f3f4f6',
          strong: '#d1d5db',
          focus: '#3b82f6',
          error: '#ef4444',
        },
      },
      // Font Family - Inter (Stripe-style)
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'monospace'],
      },
      // Font Sizes with line heights
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }],    // 12px
        sm: ['0.8125rem', { lineHeight: '1.5' }],  // 13px
        base: ['0.875rem', { lineHeight: '1.5' }], // 14px
        lg: ['1rem', { lineHeight: '1.6' }],       // 16px
        xl: ['1.25rem', { lineHeight: '1.4' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],  // 24px
        '3xl': ['1.875rem', { lineHeight: '1.2' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }], // 36px
      },
      // Border Radius (Stripe style - smooth, not too round)
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      // Shadows (Stripe's Signature - subtle, layered)
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        // Stripe-style card shadow (subtle border + shadow)
        card: '0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)',
        // Elevated card (hover state)
        'card-hover': '0 0 0 1px rgb(0 0 0 / 0.05), 0 4px 12px 0 rgb(0 0 0 / 0.1)',
        // Focus ring
        focus: '0 0 0 2px #ffffff, 0 0 0 4px #3b82f6',
      },
      // Spacing Scale (4px base like Stripe)
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      // Animation & Transitions
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        slow: '200ms',
        slower: '300ms',
      },
      // Keyframes
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 150ms ease',
        slideUp: 'slideUp 200ms ease',
        slideDown: 'slideDown 200ms ease',
        slideRight: 'slideRight 200ms ease',
        scaleIn: 'scaleIn 150ms ease',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
