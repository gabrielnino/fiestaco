'use client';

// import React from 'react';

interface CheckoutFlowProps {
  className?: string;
}

export default function CheckoutFlow({ className = '' }: CheckoutFlowProps) {
  return (
    <div className={`checkout-flow ${className}`}>
      {/* Placeholder component for FiestaWizard */}
      <div style={{ padding: '20px', background: '#fff0f5', borderRadius: '8px' }}>
        <p>Checkout Flow Component</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          This is a placeholder component for the FiestaWizard.
        </p>
      </div>
    </div>
  );
}