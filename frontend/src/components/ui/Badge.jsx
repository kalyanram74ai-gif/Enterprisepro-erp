import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-700/50',
    info: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-700/50',
  };

  // Status text automatic matching
  const text = typeof children === 'string' ? children.toUpperCase() : '';
  let autoVariant = variant;

  if (['ACTIVE', 'COMPLETED', 'APPROVED', 'PAID', 'DELIVERED', 'OPERATIONAL', 'WON'].includes(text)) {
    autoVariant = 'success';
  } else if (['PENDING', 'IN_PROGRESS', 'IN_TRANSIT', 'ISSUED', 'PROPOSAL', 'QUALIFIED', 'HALF_DAY'].includes(text)) {
    autoVariant = 'warning';
  } else if (['REJECTED', 'TERMINATED', 'CANCELLED', 'DISPOSED', 'LOST', 'LOW_STOCK'].includes(text)) {
    autoVariant = 'danger';
  } else if (['LATE', 'REVIEW', 'CONTACTED'].includes(text)) {
    autoVariant = 'purple';
  }

  const selected = variantStyles[autoVariant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selected} ${className}`}
    >
      {children}
    </span>
  );
}
