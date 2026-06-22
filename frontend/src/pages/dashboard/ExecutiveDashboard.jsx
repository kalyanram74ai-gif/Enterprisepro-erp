import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Building2,
  FolderKanban,
  ShoppingCart,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const summary = await api.get('/dashboard/summary', 'dashboard');
      setData(summary);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Executive Dashboard KPIs...</div>;
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Executive Overview & KPIs"
        description="Consolidated real-time metrics across all business operations and financial ledgers"
        actions={
          <div className="flex items-center space-x-2">
            <Link
              to="/sales/orders"
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Create Sales Order
            </Link>
            <Link
              to="/procurement/orders"
              className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Issue Purchase Order
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(data.monthlyRevenue)}
          change="+18.4% vs last mo"
          isPositive={true}
          icon={DollarSign}
          color="blue"
          subtitle={`Net Profit: ${formatCurrency(data.netProfit)}`}
        />
        <StatCard
          title="Total Sales Volume"
          value={formatCurrency(data.totalSales)}
          change="+12.2% YTD"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
          subtitle={`${data.pendingOrders || 7} orders in fulfillment`}
        />
        <StatCard
          title="Inventory Valuation"
          value={formatCurrency(data.inventoryValuation)}
          change={`${data.lowStockCount || 0} Low Stock Alerts`}
          isPositive={data.lowStockCount === 0}
          icon={Package}
          color="amber"
          subtitle="Across 2 Central Warehouses"
        />
        <StatCard
          title="Active Workforce"
          value={`${data.activeEmployees || 46} / ${data.totalEmployees || 48}`}
          change="98% Operational"
          isPositive={true}
          icon={Users}
          color="purple"
          subtitle={`${data.pendingLeaves || 0} pending leave approvals`}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Expenses Profit Curve */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Revenue vs Operating Expenses (2026)</h3>
              <p className="text-xs text-slate-400">Monthly breakdown and gross cashflow margins</p>
            </div>
            <Badge variant="success">Positive Cashflow</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenueChart || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [formatCurrency(val), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Share */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Revenue by Product Line</h3>
            <p className="text-xs text-slate-400">Share of revenue distribution</p>
          </div>
          <div className="h-60 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.salesByProductCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="category"
                >
                  {(data.salesByProductCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Revenue Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            {(data.salesByProductCategory || []).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{item.category} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Row: Department Headcount & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Bar Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-white tracking-tight mb-1">Department Workforce Allocation</h3>
          <p className="text-xs text-slate-400 mb-4">Active headcount per operational branch</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departmentEmployeeDistribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="employees" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Headcount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Enterprise Activity Stream */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Recent Operations Activity</h3>
                <p className="text-xs text-slate-400">Live immutable ledger events & actions</p>
              </div>
              <Link to="/system/audit" className="text-xs text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {(data.recentActivities || []).map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-800/50 text-blue-400 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{act.action}</span>
                      <Badge variant="primary">{act.module}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.description}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                      <span>By: {act.user}</span>
                      <span>•</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
