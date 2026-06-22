import React from 'react';

export function PageHeader({ title, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
      {(actions || children) && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
