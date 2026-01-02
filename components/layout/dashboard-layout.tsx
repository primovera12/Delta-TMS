'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';

interface DashboardLayoutProps {
  children: React.ReactNode;
  portal: 'dispatcher' | 'driver' | 'admin' | 'facility' | 'patient' | 'family';
  title?: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  notifications?: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
  actions?: React.ReactNode;
  showSearch?: boolean;
  fullWidth?: boolean;
}

export function DashboardLayout({
  children,
  portal,
  title,
  subtitle,
  user,
  notifications = [],
  actions,
  showSearch = true,
  fullWidth = false,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Skip link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-br-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar portal={portal} user={user} />
        </div>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 h-full w-64 lg:hidden">
              <Sidebar portal={portal} user={user} />
            </div>
          </>
        )}

        {/* Main content area */}
        <div
          className={cn(
            'flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          {/* Top bar */}
          <Topbar
            title={title}
            subtitle={subtitle}
            sidebarCollapsed={sidebarCollapsed}
            onMenuClick={() => setMobileMenuOpen(true)}
            showSearch={showSearch}
            user={user}
            notifications={notifications}
            actions={actions}
          />

          {/* Page content */}
          <main
            id="main-content"
            className={cn(
              'flex-1 p-4 lg:p-6',
              !fullWidth && 'mx-auto w-full max-w-7xl'
            )}
            tabIndex={-1}
          >
            {children}
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}
