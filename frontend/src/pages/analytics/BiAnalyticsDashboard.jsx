import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart as PieChartIcon,
  ShieldCheck,
  Target,
  Layers,
  ArrowUpRight,
  Activity,
  Boxes
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function BiAnalyticsDashboard() {
  const [kpiData, setKpiData] = useState(null);
  const [channels, setChannels] = useState([]);
  const [turnover, setTurnover] = useState([]);
  const [profitability, setProfitability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBiData() {
      try {
        const [kpis, ch, to, pf] = await Promise.all([
          api.get('/analytics/bi/kpi-summary', 'biKpis'),
          api.get('/analytics/bi/revenue-breakdown', 'biChannels'),
          api.get('/analytics/bi/inventory-turnover', 'biTurnover'),
          api.get('/analytics/bi/profitability-trends', 'biProfitability')
        ]);

        setKpiData(kpis || {
          totalGrossRevenue: 450000,
          netOperatingIncome: 240000,
          operatingExpenseTotal: 210000,
          grossMarginPercentage: 53.3,
          operatingMarginPercentage: 43.7,
          yearOverYearGrowthRate: 18.4,
          totalActiveOrders: 124,
          totalActiveCustomers: 86,
          inventoryEfficiencyScore: 88.4,
          employeeProductivityIndex: 18000,
          quarterlyRevenueTrend: [
            { quarter: 'Q1', revenue: 112000, marginPercent: 28.4 },
            { quarter: 'Q2', revenue: 145000, marginPercent: 31.2 },
            { quarter: 'Q3', revenue: 168000, marginPercent: 33.5 },
            { quarter: 'Q4', revenue: 195000, marginPercent: 36.0 }
          ],
          departmentPerformanceMetrics: [
            { name: 'Sales & Enterprise', budgetUtilization: 78.5, efficiency: 92.0 },
            { name: 'Manufacturing & Supply', budgetUtilization: 84.2, efficiency: 89.4 },
            { name: 'Engineering & IT', budgetUtilization: 65.0, efficiency: 95.1 },
            { name: 'Operations & HR', budgetUtilization: 71.3, efficiency: 90.8 }
          ]
        });

        setChannels(ch || [
          { category: 'Direct Enterprise B2B', amount: 245000, percentageShare: 45.5, transactionCount: 142 },
          { category: 'Channel Partners & Distributors', amount: 142000, percentageShare: 26.4, transactionCount: 89 },
          { category: 'Digital Platform & eCommerce', amount: 98000, percentageShare: 18.2, transactionCount: 312 },
          { category: 'Professional Services & Consulting', amount: 53500, percentageShare: 9.9, transactionCount: 45 }
        ]);

        setTurnover(to || [
          { productCategory: 'Raw Materials', turnoverRatio: 8.4, averageDaysInInventory: 43, stockValuation: 185000, efficiencyRating: 'HIGH' },
          { productCategory: 'Work in Progress (WIP)', turnoverRatio: 12.1, averageDaysInInventory: 30, stockValuation: 92000, efficiencyRating: 'OPTIMAL' },
          { productCategory: 'Finished Goods', turnoverRatio: 6.8, averageDaysInInventory: 54, stockValuation: 310000, efficiencyRating: 'GOOD' },
          { productCategory: 'MRO & Supplies', turnoverRatio: 4.2, averageDaysInInventory: 87, stockValuation: 42000, efficiencyRating: 'MODERATE' }
        ]);

        setProfitability(pf || [
          { period: 'Jan 2026', grossRevenue: 115000, costOfGoodsSold: 62000, operatingExpenses: 28000, netEbitda: 25000, netMarginPercent: 21.7 },
          { period: 'Feb 2026', grossRevenue: 128000, costOfGoodsSold: 68000, operatingExpenses: 29500, netEbitda: 30500, netMarginPercent: 23.8 },
          { period: 'Mar 2026', grossRevenue: 142000, costOfGoodsSold: 74000, operatingExpenses: 31000, netEbitda: 37000, netMarginPercent: 26.1 },
          { period: 'Apr 2026', grossRevenue: 155000, costOfGoodsSold: 81000, operatingExpenses: 32500, netEbitda: 41500, netMarginPercent: 26.8 }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadBiData();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  if (loading || !kpiData) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Business Intelligence Suite...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence & Analytics"
        subtitle="Cross-enterprise performance metrics, channel attribution, and profitability intelligence"
        badge="BI & Strategy"
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(kpiData.totalGrossRevenue)}
          trend={`+${kpiData.yearOverYearGrowthRate || 18.4}% YoY`}
          trendUp={true}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Operating Margin"
          value={`${kpiData.operatingMarginPercentage || 43.7}%`}
          trend="Gross: 53.3%"
          trendUp={true}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Inventory Efficiency"
          value={`${kpiData.inventoryEfficiencyScore || 88.4}/100`}
          trend="Optimal Turnover"
          trendUp={true}
          icon={Boxes}
          color="violet"
        />
        <StatCard
          title="Employee Productivity"
          value={formatCurrency(kpiData.employeeProductivityIndex || 18000)}
          trend="Revenue / FTE"
          trendUp={true}
          icon={Target}
          color="amber"
        />
      </div>

      {/* Quarterly Trend and Department Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Quarterly Trajectory & Margin Expansion</h3>
              <p className="text-xs text-slate-400">Revenue (USD) vs Margin Performance</p>
            </div>
            <Badge variant="info">Quarterly</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData.quarterlyRevenueTrend || []}>
                <defs>
                  <linearGradient id="biRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="quarter" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#biRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Department Budget vs Operating Efficiency</h3>
              <p className="text-xs text-slate-400">Resource allocation vs target delivery</p>
            </div>
            <Badge variant="success">Operational</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData.departmentPerformanceMetrics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="budgetUtilization" name="Budget Utilized %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiency" name="Efficiency Rating %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Attribution & Inventory Velocity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-100 mb-1">Channel Revenue Attribution</h3>
          <p className="text-xs text-slate-400 mb-4">Multi-channel enterprise sales performance</p>
          <div className="space-y-3">
            {channels.map((ch, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">{ch.category}</div>
                  <div className="text-[11px] text-slate-400">{ch.transactionCount} transactions</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-400">{formatCurrency(ch.amount)}</div>
                  <div className="text-[11px] text-slate-400">{ch.percentageShare}% share</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Velocity */}
        <div className="card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-100 mb-1">Inventory Velocity & Carrying Analysis</h3>
          <p className="text-xs text-slate-400 mb-4">Turnover metrics across active asset classes</p>
          <div className="space-y-3">
            {turnover.map((to, idx) => (
              <div key={idx} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">{to.productCategory}</div>
                  <div className="text-[11px] text-slate-400">Avg {to.averageDaysInInventory} days in inventory</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-100">{to.turnoverRatio}x Turnover</div>
                  <Badge variant={to.efficiencyRating === 'OPTIMAL' ? 'success' : 'info'}>
                    {to.efficiencyRating}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BiAnalyticsDashboard;
