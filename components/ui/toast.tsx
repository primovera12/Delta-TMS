'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          title: 'group-[.toast]:text-gray-900 group-[.toast]:font-medium',
          description: 'group-[.toast]:text-gray-500',
          actionButton:
            'group-[.toast]:bg-primary-600 group-[.toast]:text-white group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium',
          error:
            'group-[.toaster]:bg-error-50 group-[.toaster]:border-error-200 group-[.toaster]:text-error-700',
          success:
            'group-[.toaster]:bg-success-50 group-[.toaster]:border-success-200 group-[.toaster]:text-success-700',
          warning:
            'group-[.toaster]:bg-warning-50 group-[.toaster]:border-warning-200 group-[.toaster]:text-warning-700',
          info: 'group-[.toaster]:bg-info-50 group-[.toaster]:border-info-200 group-[.toaster]:text-info-700',
        },
      }}
    />
  );
}

export { Toaster, toast };
