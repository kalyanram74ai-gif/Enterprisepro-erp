import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, BarChart3, Users2, Database } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Left Branding Showcase */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-blue-500/30">
              E
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-lg block">ENTERPRISEPRO</span>
              <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase block -mt-1">
                Enterprise Resource Planning
              </span>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise-Scale Intelligent Resource & Workflow Automation
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Complete interconnected management across Human Resources, General Ledger Accounting, Supply Chain Logistics, Manufacturing BOM, and CRM funnels.
            </p>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
            <h4 className="text-xs font-bold text-white">17 RBAC Roles</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Granular security permissions</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <BarChart3 className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Real-Time Ledger</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Double-entry trial balances</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <Users2 className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="text-xs font-bold text-white">HR & Payroll Suite</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated payroll & leaves</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <Database className="w-5 h-5 text-cyan-400 mb-2" />
            <h4 className="text-xs font-bold text-white">Inventory & SCM</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Multi-warehouse replenishment</p>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          © 2026 ENTERPRISEPRO Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
