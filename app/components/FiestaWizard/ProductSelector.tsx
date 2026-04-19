'use client';

// import React from 'react';

interface ProductSelectorProps {
  className?: string;
}

export default function ProductSelector({ className = '' }: ProductSelectorProps) {
  return (
    <div className={`product-selector ${className}`}>
      {/* Placeholder component for FiestaWizard */}
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <p>Product Selector Component</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          This is a placeholder component for the FiestaWizard.
        </p>
      </div>
    </div>
  );
}