'use client';

// import React from 'react';

interface CartSummaryProps {
  className?: string;
}

export default function CartSummary({ className = '' }: CartSummaryProps) {
  return (
    <div className={`cart-summary ${className}`}>
      {/* Placeholder component for FiestaWizard */}
      <div style={{ padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
        <p>Cart Summary Component</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          This is a placeholder component for the FiestaWizard.
        </p>
      </div>
    </div>
  );
}