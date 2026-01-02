'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Car,
  Users,
  Building2,
  Calendar,
  Settings,
  FileText,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  BarChart3,
  Truck,
  CreditCard,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

// Navigation configuration for different portals
const dispatcherNav: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/dispatcher', icon: LayoutDashboard },
      { title: 'Trips', href: '/dispatcher/trips', icon: Car },
      { title: 'Schedule', href: '/dispatcher/schedule', icon: Calendar },
      { title: 'Map View', href: '/dispatcher/map', icon: MapPin },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Patients', href: '/dispatcher/patients', icon: Users },
      { title: 'Drivers', href: '/dispatcher/drivers', icon: Truck },
      { title: 'Facilities', href: '/dispatcher/facilities', icon: Building2 },
      { title: 'Standing Orders', href: '/dispatcher/standing-orders', icon: Clock },
    ],
  },
  {
    title: 'Reports',
    items: [
      { title: 'Analytics', href: '/dispatcher/analytics', icon: BarChart3 },
      { title: 'Reports', href: '/dispatcher/reports', icon: FileText },
    ],
  },
];

const driverNav: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/driver', icon: LayoutDashboard },
      { title: 'My Trips', href: '/driver/trips', icon: Car },
      { title: 'Schedule', href: '/driver/schedule', icon: Calendar },
      { title: 'Navigation', href: '/driver/navigation', icon: MapPin },
    ],
  },
  {
    title: 'Account',
    items: [
      { title: 'Earnings', href: '/driver/earnings', icon: CreditCard },
      { title: 'Documents', href: '/driver/documents', icon: FileText },
      { title: 'Vehicle', href: '/driver/vehicle', icon: Truck },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Vehicles', href: '/admin/vehicles', icon: Truck },
      { title: 'Facilities', href: '/admin/facilities', icon: Building2 },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Pricing', href: '/admin/pricing', icon: CreditCard },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
      { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
    ],
  },
];

const facilityNav: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/facility', icon: LayoutDashboard },
      { title: 'Book Trip', href: '/facility/book', icon: Car },
      { title: 'Patients', href: '/facility/patients', icon: Users },
      { title: 'Trips', href: '/facility/trips', icon: Calendar },
    ],
  },
  {
    title: 'Billing',
    items: [
      { title: 'Invoices', href: '/facility/invoices', icon: FileText },
      { title: 'Standing Orders', href: '/facility/standing-orders', icon: Clock },
    ],
  },
];

const patientNav: NavGroup[] = [
  {
    items: [
      { title: 'Dashboard', href: '/patient', icon: LayoutDashboard },
      { title: 'Book Trip', href: '/patient/book', icon: Car },
      { title: 'My Trips', href: '/patient/trips', icon: Calendar },
      { title: 'History', href: '/patient/history', icon: Clock },
    ],
  },
];

interface SidebarProps {
  portal: 'dispatcher' | 'driver' | 'admin' | 'facility' | 'patient' | 'family';
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function Sidebar({ portal, user }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  const navGroups = React.useMemo(() => {
    switch (portal) {
      case 'dispatcher':
        return dispatcherNav;
      case 'driver':
        return driverNav;
      case 'admin':
        return adminNav;
      case 'facility':
        return facilityNav;
      case 'patient':
      case 'family':
        return patientNav;
      default:
        return dispatcherNav;
    }
  }, [portal]);

  const portalName = React.useMemo(() => {
    const names = {
      dispatcher: 'Dispatch',
      driver: 'Driver',
      admin: 'Admin',
      facility: 'Facility',
      patient: 'Patient',
      family: 'Family',
    };
    return names[portal];
  }, [portal]);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && (
            <Link href={`/${portal}`} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Delta</span>
                <span className="text-xs text-gray-500 block -mt-0.5">{portalName}</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href={`/${portal}`} className="mx-auto">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={cn(groupIndex > 0 && 'mt-6')}>
              {group.title && !collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {group.title}
                </h3>
              )}
              {group.title && collapsed && (
                <div className="mb-2 border-t border-gray-100 mx-2" />
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary-600')} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-medium text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <li key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-2">
                            {item.title}
                            {item.badge && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-medium text-white">
                                {item.badge}
                              </span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  }

                  return <li key={item.href}>{linkContent}</li>;
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200">
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center py-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          {/* User */}
          {user && (
            <div className={cn('border-t border-gray-200 p-3', collapsed && 'px-2')}>
              <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
                <Avatar size="sm" status="online">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.role}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
