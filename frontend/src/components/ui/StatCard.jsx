import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, change, isPositive, icon: Icon, color = 'blue', subtitle }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/20',
    purple: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-sky-500/10 text-cyan-400 border-cyan-500/20',
  };

  const selectedTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-xl transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-gradient-to-br border ${selectedTheme}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        {change && (
          <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1 text-rose-400" />}
            {change}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      )}

      {/* Decorative subtle ambient glow background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
    </div>
  );
}
