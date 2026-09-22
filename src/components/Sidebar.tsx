/**
 * CipherVault Enterprise - Sidebar Navigation
 * Provides enterprise navigation items with badge counters and storage quota tracker
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderLock,
  Cpu,
  UserCheck,
  ShieldAlert,
  BarChart3,
  History,
  FileSpreadsheet,
  FileCode2,
  HardDrive,
  Network,
  LockKeyhole,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, files, storageStats, auditLogs, securityEvents } = useApp();

  const navItems = [
    {
      id: 'explorer',
      label: 'Secure File Explorer',
      icon: FolderLock,
      badge: files.filter(f => !f.isInRecycleBin).length,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
    },
    {
      id: 'cpabe',
      label: 'CP-ABE Policy Studio',
      icon: Cpu,
      badge: 'Engine',
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300',
    },
    {
      id: 'users',
      label: 'Users & Attributes (ABAC)',
      icon: UserCheck,
      badge: 'RBAC',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    },
    {
      id: 'security',
      label: 'Security Center & Lab',
      icon: ShieldAlert,
      badge: securityEvents.length > 0 ? `${securityEvents.length} Alerts` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    },
    {
      id: 'analytics',
      label: 'Analytics & Trends',
      icon: BarChart3,
    },
    {
      id: 'audits',
      label: 'Immutable Audit Logs',
      icon: History,
      badge: auditLogs.length,
      badgeColor: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    },
    {
      id: 'reports',
      label: 'Compliance Reports',
      icon: FileSpreadsheet,
    },
    {
      id: 'artifacts',
      label: 'Spring Boot 3.5 & Docker',
      icon: FileCode2,
      badge: 'Java 21',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    },
    {
      id: 'diagrams',
      label: 'Architecture & Workflows',
      icon: Network,
    },
  ];

  const storageUsedGB = (storageStats.usedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const storageTotalGB = (storageStats.totalBytes / (1024 * 1024 * 1024)).toFixed(0);
  const storagePercent = Math.min(
    100,
    Math.round((storageStats.usedBytes / storageStats.totalBytes) * 100)
  );

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between shrink-0 h-[calc(100vh-61px)]">
      {/* Navigation list */}
      <div className="space-y-1">
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Platform Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Storage and Cryptographic Security Status Widget */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Storage Quota Card */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
              Encrypted Storage
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{storagePercent}%</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
            <span>{storageUsedGB} GB used</span>
            <span>{storageTotalGB} GB limit</span>
          </div>
        </div>

        {/* CP-ABE Master Public Key Status */}
        <div className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <LockKeyhole className="w-3.5 h-3.5 text-indigo-500" />
            CP-ABE Zero-Trust
          </span>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            ENFORCED
          </span>
        </div>
      </div>
    </aside>
  );
};
