import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  BookOpen,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Package,
  ArrowLeftRight,
  Warehouse,
  Truck,
  ShoppingCart,
  Contact2,
  BadgeDollarSign,
  FileCheck2,
  Flame,
  KanbanSquare,
  Cpu,
  Boxes,
  ShieldAlert,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  ChevronLeft,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MODULE_PERMISSIONS, hasPermission } from '../../constants/roles';

export function Sidebar() {
  const { user, checkRole, switchRoleDemo } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    hr: true,
    finance: true,
    inventory: true,
    sales: true,
    operations: false,
    system: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navGroups = [
    {
      id: 'core',
      title: 'CORE',
      items: [
        { path: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, permission: MODULE_PERMISSIONS.DASHBOARD },
        { path: '/analytics/bi', label: 'BI & Analytics Suite', icon: Boxes, permission: MODULE_PERMISSIONS.DASHBOARD }
      ]
    },
    {
      id: 'hr',
      title: 'HUMAN RESOURCES',
      permission: MODULE_PERMISSIONS.HR,
      items: [
        { path: '/hr/employees', label: 'Employees Directory', icon: Users },
        { path: '/hr/departments', label: 'Departments & Org', icon: Building2 },
        { path: '/hr/attendance', label: 'Attendance Tracker', icon: CalendarCheck },
        { path: '/hr/leaves', label: 'Leave Applications', icon: CalendarDays },
        { path: '/hr/payroll', label: 'Payroll & Payslips', icon: CreditCard }
      ]
    },
    {
      id: 'finance',
      title: 'FINANCIAL MANAGEMENT',
      permission: MODULE_PERMISSIONS.FINANCE,
      items: [
        { path: '/finance/accounts', label: 'Chart of Accounts', icon: BookOpen },
        { path: '/finance/journal', label: 'Journal Entries', icon: DollarSign },
        { path: '/finance/expenses', label: 'Expenses Ledger', icon: Receipt },
        { path: '/finance/reports', label: 'Financial Reports', icon: FileSpreadsheet }
      ]
    },
    {
      id: 'inventory',
      title: 'INVENTORY & SUPPLY',
      permission: MODULE_PERMISSIONS.INVENTORY,
      items: [
        { path: '/inventory/products', label: 'Product Catalog', icon: Package },
        { path: '/inventory/movements', label: 'Stock Movements', icon: ArrowLeftRight },
        { path: '/inventory/warehouses', label: 'Warehouses', icon: Warehouse }
      ]
    },
    {
      id: 'procurement',
      title: 'PROCUREMENT & VENDORS',
      permission: MODULE_PERMISSIONS.PROCUREMENT,
      items: [
        { path: '/procurement/vendors', label: 'Vendor Directory', icon: Truck },
        { path: '/procurement/orders', label: 'Purchase Orders', icon: ShoppingCart }
      ]
    },
    {
      id: 'sales',
      title: 'SALES & CRM PIPELINE',
      permission: MODULE_PERMISSIONS.SALES,
      items: [
        { path: '/sales/customers', label: 'Customer Directory', icon: Contact2 },
        { path: '/sales/orders', label: 'Sales Orders', icon: BadgeDollarSign },
        { path: '/sales/invoices', label: 'Invoices & Billing', icon: FileCheck2 },
        { path: '/sales/crm', label: 'CRM Opportunities', icon: Flame }
      ]
    },
    {
      id: 'operations',
      title: 'OPERATIONS & ASSETS',
      permission: MODULE_PERMISSIONS.OPERATIONS,
      items: [
        { path: '/operations/projects', label: 'Project Management', icon: KanbanSquare },
        { path: '/operations/manufacturing', label: 'Manufacturing & BOM', icon: Cpu },
        { path: '/operations/supply-chain', label: 'Supply Chain Tracking', icon: Boxes },
        { path: '/operations/assets', label: 'Fixed Assets', icon: Layers }
      ]
    },
    {
      id: 'system',
      title: 'ADMIN & COMPLIANCE',
      permission: MODULE_PERMISSIONS.AUDIT,
      items: [
        { path: '/system/audit', label: 'Audit Trail', icon: ShieldAlert },
        { path: '/system/settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20">
              E
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm block">ENTERPRISEPRO</span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase block -mt-1">
                ERP System
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20 mx-auto">
            E
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Role Switcher Demo Widget */}
      {!collapsed && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5 text-slate-400 font-medium">
            <span className="flex items-center text-[11px]"><UserCheck className="w-3.5 h-3.5 mr-1 text-blue-400" /> Active Role Demo</span>
          </div>
          <select
            onChange={(e) => switchRoleDemo(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/70 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="SUPER_ADMIN">👑 Super Admin</option>
            <option value="HR_MANAGER">👥 HR Manager</option>
            <option value="FINANCE_MANAGER">💰 Finance Manager</option>
            <option value="INVENTORY_MANAGER">📦 Inventory Manager</option>
            <option value="SALES_MANAGER">📈 Sales Director</option>
            <option value="PROJECT_MANAGER">🚀 Project Manager</option>
          </select>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group) => {
          if (group.permission && !checkRole(group.permission)) return null;

          return (
            <div key={group.id} className="space-y-1">
              {!collapsed && (
                <div
                  onClick={() => group.id !== 'core' && toggleSection(group.id)}
                  className="flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-500 tracking-wider uppercase cursor-pointer hover:text-slate-400 select-none"
                >
                  <span>{group.title}</span>
                  {group.id !== 'core' && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        openSections[group.id] ? '' : '-rotate-90'
                      }`}
                    />
                  )}
                </div>
              )}

              {(collapsed || group.id === 'core' || openSections[group.id]) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                          } ${collapsed ? 'justify-center' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
