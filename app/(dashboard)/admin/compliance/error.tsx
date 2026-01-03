'use client';

import { useEffect } from 'react';

export default function ComplianceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Compliance page error:', error);
  }, [error]);

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <h2 style={{ color: '#991b1b', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          Compliance Page Error
        </h2>
        <p style={{ color: '#b91c1c', marginBottom: '12px' }}>
          {error.message || 'An unknown error occurred'}
        </p>
        {error.digest && (
          <p style={{ color: '#b91c1c', fontSize: '12px' }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={reset}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/admin'}
          style={{
            background: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Admin
        </button>
      </div>
    </div>
  );
}
