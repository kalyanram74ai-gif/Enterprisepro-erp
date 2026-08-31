import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { api } from '../../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Filter,
  CheckCircle2
} from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, lowCount: 0, mediumCount: 0, highCount: 0, criticalCount: 0 });
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState('ALL');

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  const loadLogs = async () => {
    const data = await api.get('/audit/logs', 'auditLogs');
    const list = Array.isArray(data) ? data : data?.content || [];
    setLogs(list);
  };

  const loadStats = async () => {
    try {
      const dist = await api.get('/audit/stats/severity-distribution');
      if (dist && dist.totalEvents !== undefined) {
        setStats(dist);
      }
    } catch {
      // Fallback
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedSeverity !== 'ALL' && (log.severity || 'LOW').toUpperCase() !== selectedSeverity) {
      return false;
    }
    if (selectedModule !== 'ALL' && (log.module || '').toUpperCase() !== selectedModule) {
      return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Username', 'Action', 'Module', 'Severity', 'Description', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id || '',
      l.timestamp || '',
      `"${l.username || ''}"`,
      `"${l.action || ''}"`,
      `"${l.module || ''}"`,
      `"${l.severity || 'LOW'}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${l.ipAddress || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit-compliance-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    if (s === 'CRITICAL') return <Badge variant="danger">CRITICAL</Badge>;
    if (s === 'HIGH') return <Badge variant="warning">HIGH</Badge>;
    if (s === 'MEDIUM') return <Badge variant="info">MEDIUM</Badge>;
    return <Badge variant="default">LOW</Badge>;
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (val) => <span className="font-mono text-slate-400 text-xs">{new Date(val).toLocaleString()}</span>
    },
    {
      header: 'User Principal',
      accessor: 'username',
      render: (val) => (
        <div className="flex items-center space-x-1.5 font-semibold text-white">
          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>{val}</span>
        </div>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (val) => getSeverityBadge(val)
    },
    {
      header: 'Event Action',
      accessor: 'action',
      render: (val) => <span className="font-mono font-bold text-slate-200">{val}</span>
    },
    {
      header: 'Module Scope',
      accessor: 'module',
      render: (val) => <Badge variant="primary">{val}</Badge>
    },
    {
      header: 'Activity Description',
      accessor: 'description',
      render: (val) => <span className="text-slate-300 text-xs">{val}</span>
    },
    {
      header: 'Origin IP',
      accessor: 'ipAddress',
      render: (val) => <span className="font-mono text-slate-400 text-xs">{val || '127.0.0.1'}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Audit Trail & Compliance Log"
        description="Immutable real-time audit ledger logging all administrative events, role changes, financial postings and logins"
        action={{
          label: 'Export Audit CSV',
          icon: Download,
          onClick: exportCsv
        }}
      />

      {/* Compliance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audit Records"
          value={logs.length}
          trend="Immutable Ledger"
          trendUp={true}
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard
          title="Critical Incidents"
          value={stats.criticalCount || logs.filter((l) => (l.severity || '').toUpperCase() === 'CRITICAL').length}
          trend="Immediate Review"
          trendUp={false}
          icon={ShieldAlert}
          color="rose"
        />
        <StatCard
          title="High Severity Events"
          value={stats.highCount || logs.filter((l) => (l.severity || '').toUpperCase() === 'HIGH').length}
          trend="Elevated Action"
          trendUp={false}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Active System Principals"
          value={new Set(logs.map((l) => l.username)).size}
          trend="Audited Accounts"
          trendUp={true}
          icon={UserCheck}
          color="emerald"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Severity:</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Module:</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Modules</option>
            <option value="AUTH">AUTH</option>
            <option value="FINANCE">FINANCE</option>
            <option value="HR">HR</option>
            <option value="INVENTORY">INVENTORY</option>
            <option value="SALES">SALES</option>
            <option value="PROCUREMENT">PROCUREMENT</option>
            <option value="SECURITY">SECURITY</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-400">
          Showing <span className="font-bold text-slate-200">{filteredLogs.length}</span> of{' '}
          <span className="font-bold text-slate-200">{logs.length}</span> events
        </div>
      </div>

      <DataTable
        title="Security & Activity Audit Stream"
        columns={columns}
        data={filteredLogs}
        searchPlaceholder="Search audit events by user, action, module..."
      />
    </div>
  );
}
export default AuditLogs;
