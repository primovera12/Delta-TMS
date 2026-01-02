'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import {
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  sidebarCollapsed?: boolean;
  onMenuClick?: () => void;
  showSearch?: boolean;
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
}

export function Topbar({
  title,
  subtitle,
  sidebarCollapsed,
  onMenuClick,
  showSearch = true,
  user,
  notifications = [],
  actions,
}: TopbarProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Title */}
        {title && (
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search trips, patients, drivers..."
                className="w-48 pl-9 md:w-64 lg:w-80"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Custom actions */}
        {actions}

        {/* Mobile search button */}
        {showSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-11 w-11">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-medium text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-sm">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="primary" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    'flex flex-col items-start gap-1 py-3',
                    !notification.read && 'bg-primary-50/50'
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className="font-medium text-gray-900">
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary-600" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {notification.message}
                  </span>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </DropdownMenuItem>
              ))
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary-600">
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" className="hidden lg:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-gray-100"
              >
                <Avatar size="sm">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden lg:block text-sm font-medium text-gray-700">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-56 max-w-xs">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs font-normal text-gray-500">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white p-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="w-full pl-9"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => setSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
