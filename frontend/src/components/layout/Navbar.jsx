import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, LogOut, CheckCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Global Fast Search */}
      <div className="flex items-center w-80 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Global ERP quick search (Ctrl + K)..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Core Node: Healthy
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-2.5 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors ${
                        !n.isRead ? 'bg-slate-800/20' : 'opacity-60'
                      }`}
                    >
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden md:inline-block">
              {user?.fullName || 'User'}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-scale-up">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-1 flex items-center px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
