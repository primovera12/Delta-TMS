'use client';

// Ultra-minimal compliance page using only native HTML to debug
export default function AdminCompliancePage() {
  const items = [
    { id: '1', name: "Driver's License - John Smith", status: 'expiring' },
    { id: '2', name: "Driver's License - Sarah Johnson", status: 'compliant' },
    { id: '3', name: 'Background Check - Mike Davis', status: 'expired' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Compliance Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Monitor regulatory compliance and document expiration
      </p>

      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '16px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          All Compliance Items
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: '12px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{item.name}</span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                background: item.status === 'compliant' ? '#dcfce7' :
                           item.status === 'expiring' ? '#fef9c3' : '#fee2e2',
                color: item.status === 'compliant' ? '#166534' :
                       item.status === 'expiring' ? '#854d0e' : '#991b1b'
              }}>
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
