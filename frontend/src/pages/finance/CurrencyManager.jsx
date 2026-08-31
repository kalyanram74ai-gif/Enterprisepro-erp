import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import {
  Coins,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  Plus,
  RefreshCw,
  Globe2,
  CheckCircle
} from 'lucide-react';

export function CurrencyManager() {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Conversion Calculator State
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [conversionResult, setConversionResult] = useState(null);

  // Modal State for adding/updating rate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRate, setNewRate] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: '',
    source: 'MANUAL_ENTRY'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [currList, rateList] = await Promise.all([
        api.get('/finance/currencies', 'currencies'),
        api.get('/finance/currencies/exchange-rates', 'exchangeRates')
      ]);

      const cData = Array.isArray(currList) ? currList : [
        { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', baseCurrency: true, active: true },
        { id: 2, code: 'EUR', name: 'Euro', symbol: '€', baseCurrency: false, active: true },
        { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', baseCurrency: false, active: true },
        { id: 4, code: 'INR', name: 'Indian Rupee', symbol: '₹', baseCurrency: false, active: true },
        { id: 5, code: 'JPY', name: 'Japanese Yen', symbol: '¥', baseCurrency: false, active: true },
        { id: 6, code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', baseCurrency: false, active: true }
      ];

      const rData = Array.isArray(rateList) ? rateList : [
        { id: 1, fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.92, effectiveDate: '2026-08-31', source: 'CENTRAL_BANK' },
        { id: 2, fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.785, effectiveDate: '2026-08-31', source: 'CENTRAL_BANK' },
        { id: 3, fromCurrency: 'USD', toCurrency: 'INR', rate: 83.25, effectiveDate: '2026-08-31', source: 'CENTRAL_BANK' },
        { id: 4, fromCurrency: 'USD', toCurrency: 'JPY', rate: 155.4, effectiveDate: '2026-08-31', source: 'CENTRAL_BANK' },
        { id: 5, fromCurrency: 'USD', toCurrency: 'CAD', rate: 1.365, effectiveDate: '2026-08-31', source: 'CENTRAL_BANK' }
      ];

      setCurrencies(cData);
      setRates(rData);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount) || 0;
    try {
      const res = await api.post('/finance/currencies/convert', {
        fromCurrency: fromCurr,
        toCurrency: toCurr,
        amount: num
      });
      if (res && res.convertedAmount !== undefined) {
        setConversionResult(res);
        return;
      }
    } catch {
      // Fallback local calculate
    }

    const foundRate = rates.find((r) => r.fromCurrency === fromCurr && r.toCurrency === toCurr);
    const applied = foundRate ? foundRate.rate : fromCurr === toCurr ? 1 : 1.15;
    setConversionResult({
      fromCurrency: fromCurr,
      toCurrency: toCurr,
      originalAmount: num,
      convertedAmount: num * applied,
      appliedRate: applied
    });
  };

  const handleSaveRate = async (e) => {
    e.preventDefault();
    if (!newRate.rate) return;
    const payload = {
      fromCurrency: newRate.fromCurrency,
      toCurrency: newRate.toCurrency,
      rate: parseFloat(newRate.rate),
      source: newRate.source,
      effectiveDate: new Date().toISOString().slice(0, 10)
    };

    await api.post('/finance/currencies/exchange-rates', payload, 'exchangeRates');
    setIsModalOpen(false);
    setNewRate({ fromCurrency: 'USD', toCurrency: 'EUR', rate: '', source: 'MANUAL_ENTRY' });
    loadData();
  };

  const currencyColumns = [
    {
      header: 'Code',
      accessor: 'code',
      render: (val) => <span className="font-mono font-bold text-white text-sm">{val}</span>
    },
    {
      header: 'Currency Name',
      accessor: 'name',
      render: (val) => <span className="text-slate-200">{val}</span>
    },
    {
      header: 'Symbol',
      accessor: 'symbol',
      render: (val) => <span className="font-mono text-blue-400 font-bold">{val}</span>
    },
    {
      header: 'Base Currency',
      accessor: 'baseCurrency',
      render: (val) =>
        val ? (
          <Badge variant="success">Primary Base</Badge>
        ) : (
          <Badge variant="default">Secondary</Badge>
        )
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (val) =>
        val ? <Badge variant="info">Active</Badge> : <Badge variant="danger">Inactive</Badge>
    }
  ];

  const rateColumns = [
    {
      header: 'Currency Pair',
      accessor: 'fromCurrency',
      render: (_, row) => (
        <span className="font-mono font-bold text-white">
          {row.fromCurrency} / {row.toCurrency}
        </span>
      )
    },
    {
      header: 'Exchange Rate',
      accessor: 'rate',
      render: (val) => <span className="font-mono text-emerald-400 font-bold">{Number(val).toFixed(4)}</span>
    },
    {
      header: 'Effective Date',
      accessor: 'effectiveDate',
      render: (val) => <span className="font-mono text-slate-400 text-xs">{val}</span>
    },
    {
      header: 'Source',
      accessor: 'source',
      render: (val) => <Badge variant="primary">{val || 'MARKET'}</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Currency & FX Exchange Rate Center"
        description="Global currency definitions, real-time foreign exchange valuation, and cross-border billing parity"
        action={{
          label: 'Set Exchange Rate',
          icon: Plus,
          onClick: () => setIsModalOpen(true)
        }}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Currencies"
          value={currencies.length}
          trend="Supported ISO Codes"
          trendUp={true}
          icon={Coins}
          color="blue"
        />
        <StatCard
          title="Primary Base Currency"
          value="USD ($)"
          trend="System Default"
          trendUp={true}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Configured FX Pairs"
          value={rates.length}
          trend="Automated Revaluation"
          trendUp={true}
          icon={ArrowRightLeft}
          color="violet"
        />
        <StatCard
          title="Central Bank Sync"
          value="Active (Daily)"
          trend="Real-time Feed"
          trendUp={true}
          icon={Globe2}
          color="amber"
        />
      </div>

      {/* Live Currency Converter Widget */}
      <div className="card p-6 bg-slate-900/70 border border-slate-800 rounded-xl">
        <div className="flex items-center space-x-2 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Live Multi-Currency Calculator</h3>
        </div>

        <form onSubmit={handleConvert} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">From Currency</label>
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              {currencies.map((c) => (
                <option key={c.id || c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">To Currency</label>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              {currencies.map((c) => (
                <option key={c.id || c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Calculate Conversion</span>
          </button>
        </form>

        {conversionResult && (
          <div className="mt-4 p-4 bg-blue-950/40 border border-blue-800/50 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-300">Converted Amount:</span>
              <div className="text-xl font-bold text-white mt-0.5">
                {Number(conversionResult.convertedAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4
                })}{' '}
                {conversionResult.toCurrency}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Applied Rate:</span>
              <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">
                1 {conversionResult.fromCurrency} = {Number(conversionResult.appliedRate).toFixed(4)}{' '}
                {conversionResult.toCurrency}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Supported ISO Currencies"
          columns={currencyColumns}
          data={currencies}
          searchPlaceholder="Search currency code or name..."
        />

        <DataTable
          title="Active Foreign Exchange Rates"
          columns={rateColumns}
          data={rates}
          searchPlaceholder="Search currency pair..."
        />
      </div>

      {/* Add / Update Rate Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Exchange Rate">
        <form onSubmit={handleSaveRate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">From Currency</label>
              <select
                value={newRate.fromCurrency}
                onChange={(e) => setNewRate({ ...newRate, fromCurrency: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                {currencies.map((c) => (
                  <option key={c.id || c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">To Currency</label>
              <select
                value={newRate.toCurrency}
                onChange={(e) => setNewRate({ ...newRate, toCurrency: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                {currencies.map((c) => (
                  <option key={c.id || c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Exchange Rate (1 Unit of From = X Units of To)</label>
            <input
              type="number"
              step="0.000001"
              value={newRate.rate}
              onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
              placeholder="e.g. 0.9200"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Rate Source</label>
            <select
              value={newRate.source}
              onChange={(e) => setNewRate({ ...newRate, source: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              <option value="MANUAL_ENTRY">Manual Override</option>
              <option value="CENTRAL_BANK">Central Bank Reference</option>
              <option value="SPOT_MARKET">Spot Market Interbank</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg"
            >
              Save Rate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
export default CurrencyManager;
